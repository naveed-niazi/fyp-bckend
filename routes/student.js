const express = require("express");
const {fetchNotEnrolledStudents}=require("../controllers/students")
const { userById } = require("../controllers/user");

const router = express.Router();

router.get("/notEnrolled/:userId", fetchNotEnrolledStudents);

router.param("userId", userById);
module.exports = router;