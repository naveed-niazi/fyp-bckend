const User = require("../models/user");
const Project = require("../models/project");
const { response } = require("express");
const mongoose = require("mongoose");
const { isAdmin, isAnAdmin } = require("./auth");

exports.createProject = async (req, res) => {
      const projectExist = await Project.findOne({
            groupMembers: req.profile._id,
      });

      if (projectExist) {
            return res.status(403).json({ error: "Project has already been created" });
      } else {
            const { group, description, groupMembers } = req.body.groupData

            const { title, abstract, scope, modulesList } = req.body.projectData


            const data = {
                  groupName: group,
                  groupDescription: description,
                  department: req.profile.department,
                  groupMembers: groupMembers,
                  documentation: {
                        visionDocument: {
                              title: title,
                              abstract: abstract,
                              scope: scope,
                              majorModules: modulesList,
                              status: "Waiting for Initial Approval",
                              uploadedAt: Date.now(),
                              fileUploaded: false,
                              document: {
                                    //originalname: originalname,
                                    //filename: filename,
                                    //doctype: mimetype,
                              },
                        },
                  },
            };
            const newProject = new Project(data);

            newProject.save((err) => {
                  console.log("Saving Project");

                  if (err) {
                        return res.status(500).json({ error: err });
                  } else {
                        res.status(200).json({
                              message: "Project Created Sucessfully!",
                        });
                  }
            });
      }
};
exports.updateVisionDocument = async (req, res) => {

      const { filename, originalname, mimetype } = req.file;

      const project = await Project.findOne({
            groupMembers: req.profile._id,
      });
      if (project) {
            project.documentation.visionDocument.document.originalname = originalname;
            project.documentation.visionDocument.document.filename = filename;
            project.documentation.visionDocument.document.doctype = mimetype;
            project.documentation.visionDocument.fileUploaded = true;

            project.save((err) => {
                  console.log("Saving Project");

                  if (err) {
                        return res.status(500).json({ error: err });
                  } else {
                        res.status(200).json({
                              message: "Project Created Sucessfully!",
                        });
                  }
            });
      } else {
            return res.status(400).json({
                  message: "Unable to create Project",
            });
      }
}

exports.projectView = (req, res) => {
      Project.findOne({ groupMembers: req.profile._id })
            .populate("groupMembers", "name email student_details.batch student_details.regNo")
            .exec((err, data) => {
                  if (err)
                        return res.status(400).json({ error: "Unable to find Project!" })
                  else {
                        const { majorModules, title, abstract, scope, status, uploadedAt, document } = data.documentation.visionDocument;
                        const { originalname, filename } = document;
                        const { _id, groupMembers, groupName, groupDescription } = data;
                        return res
                              .status(200)
                              .json({
                                    _id,
                                    majorModules,
                                    title,
                                    abstract,
                                    scope,
                                    status,
                                    uploadedAt,
                                    groupMembers,
                                    groupName,
                                    groupDescription,
                                    originalname,
                                    filename,
                              });
                  }
            })

}


exports.addComment = (req, res) => {
      const project = Project.findOne(
            { groupMembers: req.profile._id },
            (err, data) => {
                  if (err || !data) return res.status(200).json({ error: err });
                  else {
                        if (data instanceof Project) {
                              const comment = {
                                    text: req.body.data,
                                    createdAt: Date.now(),
                                    author: req.profile._id,
                              };
                              data.documentation.visionDocument.comments.push(comment);

                              data.save((err) => {
                                    if (err) {
                                          return res.status(500).json({ error: err });
                                    } else {
                                          res.status(200).json({
                                                message: "Comment added sucessfully!",
                                          });
                                    }
                              });
                        } else return res.status(500).json({ error: "Unable to comment" });
                  }
            }
      );
};

exports.deleteComment = async (req, res) => {
      const commentId = req.params.commentId;
      console.log("Project id: " + req.query.projectId)
      const project = await Project.findOne({ _id: req.query.projectId });
      if (project instanceof Project) {
            const { comments } = project.documentation.visionDocument
            comments.map(comment => {
                  if (comment._id == commentId) {
                        //now we have the comment we will check if it belongs to same person who wants to delete it
                        if (comment.author == req.profile._id) {
                              console.log(comment)
                              comments.pull(comment)
                              return res.status(200).json({ message: "Successfully deleted" })
                        }
                  }
            })
            return res.status(400).json({ error: "Unable to find comment" })
      } else {
            return res.status(400).json({ error: "Unable to find the project" })
      }

      // { groupMembers: req.profile._id },
      // (err, data) => {
      //       if (err || !data) return res.status(200).json({ error: err });
      //       else {
      //             if (data instanceof Project) {

      //                   data.documentation.visionDocument.comments.pull(req.params.commentId);
      //                   data.save((err) => {
      //                         if (err) {
      //                               return res.status(500).json({ error: err });
      //                         } else {
      //                               res.status(200).json({
      //                                     message: "Comment removed sucessfully!",
      //                               });
      //                         }
      //                   });
      //             } else return res.status(500).json({ error: "Unable to remove comment" });
      //       }
      // }
      //);
};

exports.fetchComments = (req, res) => {
      Project.findOne({ _id: req.query.projectId }, (err, data) => {
            if (err || !data)
                  return res.status(400).json({ error: "Unable to find Project!" });
            else {
                  const { comments } = data.documentation.visionDocument;
                  return res.status(200).json(comments);
            }
      }).populate("documentation.visionDocument.comments.author", "name")

}

exports.deleteProject = (req, res) => {
      Project.findOne(
            { groupMembers: req.profile._id },
            (err, data) => {
                  if (err || !data) return res.status(200).json({ error: err });
                  else {
                        if (data instanceof Project) {
                              if (data.documentation.visionDocument.status === "Waiting for Initial Approval" ||
                                    data.documentation.visionDocument.status === "Rejected") {
                                    data.remove((err) => {
                                          if (err) return res.status(400).json({ error: "Project Deletion Failed" });
                                          else
                                                return res.status(200).json({ message: "Project Deleted Successfully" });
                                    })

                              }
                        } else return res.status(500).json({ error: "Unable to delete project" });
                  }
            }
      );
};


exports.isProject = (req, res) => {
      Project.findOne(
            { groupMembers: req.profile._id },
            (err, data) => {
                  if (err || !data)
                        return res.status(200).json({ error: "Unable to find project" });
                  else {
                        if (data instanceof Project)
                              return res.status(200).json({ message: "Project Exists" });
                        else return res.status(500).json({ error: "Unable to find project" });
                  }
            }
      );
};