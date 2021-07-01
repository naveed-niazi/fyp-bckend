const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config();
const User = require("../models/user");
const _ = require("lodash");
const {
    sendConfirmationEmail,
    resetPasswordEmail,
    newUserEmail
} = require("../helper/emailConfig");
const { isArguments } = require("lodash");
const user = require("../models/user");

exports.addUser = async (req, res) => {
    console.log("in the user controller" + req.body)
    const { firstName, lastName, email, roles } = req.body
    const userExists = await User.findOne({ email: email });

    if (userExists) {
        return res.status(403).json({ error: "Email is taken!" });
    }

    const token = jwt.sign({ email: email }, process.env.SECRET_KEY);
    let array = [];
    console.log("-----------" + req.body)
    const user = await new User(req.body);
    user.name = firstName + " " + lastName;
    user.resetPasswordLink = token;
    user.status = "Active";
    user.emailVerficationCode = token;
    if (roles.Professor) {
        array.push("Professor")
    }
    if (roles.PO) {
        array.push("Program-Office")
    }
    if (roles.Admin) {
        array.push("Admin")
    }
    user.roles = array;
    user.password = token;
    console.log(user)
    await user.save((err) => {
        if (err) {
            return res.status(500).send({ error: "Unable to create new user" });
        }
        newUserEmail(user.name, user.email, user.resetPasswordLink);
        return res
            .status(200)
            .json({ message: "Account created Successfully" });
    });
};

exports.getUsers = async (req, res) => {
    //  sending an array of users back to front-end
    // based on the type of user required by the front end
    // I will be making sure that all the users get their point
    // what the user data is going to be in this case.

    const recordType = req.query.record

    if (recordType == "Professor") {
        users = await User.find({ roles: { $in: "Professor" } }).select("name email roles")
        return res.status(200).json({ users: users })
    }
    if (recordType == "Program-Office") {
        users = await User.find({ roles: { $in: "Program-Office" } }).select("name email roles")
        return res.status(200).json({ users: users })
    }
    if (recordType == "Admin") {
        users = await User.find({ roles: { $in: "Admin" } }).select("name email roles")
        return res.status(200).json({ users: users })
    }
    if (recordType == "Student") {
        users = await User.find({ roles: { $in: "Student" } }).select("name email student_details department")
        return res.status(200).json({ users: users })
    }
    else {
        return res.status(500).json({ error: "Record not found" })
    }
}
exports.deleteUser = async (req, res) => {
    const id = req.headers['id'];
    await User.findByIdAndDelete(id, (err, user) => {
        if (err) {
            res.status(500).json({ error: "Unable to delete User" })
        } else {
            res.status(200).json({ message: "User Deleted" })
        }
    })
}
exports.userById = (req, res, next, id) => {
    User.findById(id)
        .exec((err, user) => {
            if (err || !user) {
                return res.status(401).json({ error: 'Unable to find User!' })
            }
            user.salt = undefined;
            user.hashed_password = undefined;
            req.profile = user; //adding a parameter object of profile with info about user in the req
            next();
        });
};

exports.getUser = (req, res) => {
    return res.json(req.profile);
}
exports.getPendingUser = async (req, res) => {
    users = await User.find({
        $and:
            [
                { roles: { $in: "Student" } },
                { "student_details.isEligible": false },
            ]
    })
        .select('_id name email student_details department');
    return res.status(200).json({ users: users })
}

exports.makeEligible = async (req, res) => {

    const user = await User.findOne({ _id: req.profile._id });
    if (user.roles.includes("Student")) {
        user.student_details.isEligible = true;
        await user.save((err) => {
            if (err) {
                return res.status(500).json({ error: "Unable to Update Data" });
            } else {
                res.status(200).json({ message: "Student is now Eligible" })
            }
        })
    }
    else {
        res.status(200).json({ error: "Not a Valid Request" })
    }
}