const express = require("express");
const { createProjectValidator, canUpload } = require("../middlewares/project");
const { createProject, updateVisionDocument, deleteComment, deleteProject, projectView, fetchComments, isProject, addComment } = require("../controllers/project");
const { userById } = require("../controllers/user");
const upload = require("../middlewares/upload");

const router = express.Router();

// require signin/isStudent
router.post(
    "/create-project/:userId",
    createProjectValidator,
    createProject
);
router.put("/create-project/:type/:userId", canUpload, upload.single("file"), updateVisionDocument)
router.put("/addComment/:userId", addComment);
router.get("/projectView/:userId", projectView);
router.get("/fetchComments/:userId", fetchComments);
router.get("/isProject/:userId", isProject);

router.delete("/deleteComment/:userId/:commentId", deleteComment);
router.delete("/deleteProject/:userId/:projectId", deleteProject);


router.param("userId", userById);
module.exports = router;