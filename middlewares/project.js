const path = require('path')
const Project = require("../models/project");


exports.createProjectValidator = async (req, res, next) => {
    const { group, description, team, groupMembers } = req.body.groupData;
    const { title, abstract, scope, modulesList } = req.body.projectData;

    const validate = () => {
        if (group.trim().length < 2 || group.trim().length > 50)
            return {
                error: "group name must be between 2-50 characters",
                errorIn: "groupName",
            };
        else if (
            description.trim().length < 50 ||
            description.trim().length > 400
        )
            return {
                error: "description Must Be between 50-400 Characters",
                errorIn: "description",
            };
        else if (team === "duo" && groupMembers.length < 2)
            return { error: "Please Select Your Partner", errorIn: "team" };
        else if (title.trim().length < 2 || title.trim().length > 100)
            return {
                error: "Title Must Be between 2-100 Characters",
                errorIn: "title",
            };
        else if (abstract.trim().length < 50 || abstract.trim().length > 1000)
            return {
                error: "Abstract Must Be between 50-1000 Characters",
                errorIn: "abstract",
            };
        else if (scope.trim().length < 50 || scope.trim().length > 1000)
            return {
                error: "Scope Must Be between 50-1000 Characters",
                errorIn: "scope",
            };
        else if (modulesList.length < 3)
            return {
                error: "Add atleast 3 modules",
                errorIn: "module",
            };
        else if (modulesList.length > 10)
            return {
                error: "Number of modules can not exceed 10",
                errorIn: "module",
            };

        else return "";
    };
    const Errors = validate();
    if (Errors == "")
        next();
    else
        return res.status(400).json({ error: Errors });
};

exports.canUpload = async (req, res, next) => {
    const id = req.profile.id

    const project = await Project.findOne({
        groupMembers: req.profile._id,
    });
    if (project) {
        if (project.documentation.visionDocument.fileUploaded) {
            return res.status(400).json({ error: "Project file already exist" })
        } else
            next()
    } else
        return res.status(400).json({ error: "Shut the FUCK UP" })

}
