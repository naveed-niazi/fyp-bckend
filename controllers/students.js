const User = require("../models/user");

exports.fetchNotEnrolledStudents = async (req, res) => {

    const users = await User.where({ roles: "Student" })
        .where({ "student_details.isEligible": true})
        .where({ projectStatus: "NULL" })
        .where({ status: "Active" })
        .where({
            "student_details.batch": req.profile.student_details.batch,
        })
        .where("_id")
        .nin(req.profile._id)
        .select("_id name email role student_details.regNo");
    await res.status(200).json(users);
};