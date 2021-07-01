const express = require("express");

const { requireSignin, isAdmin, isProgramOffice } = require("../controllers/auth")
const { addUser, getUsers, deleteUser, getUser, userById, getPendingUser, makeEligible } = require("../controllers/user")
const { addUserValidator } = require("../middlewares/user")

//const { userById } = require("../controllers/user");

const router = express.Router();

router.put("/eligigbleuser/:userId", requireSignin, isProgramOffice, makeEligible);

router.get("/pendingusers", requireSignin, isProgramOffice, getPendingUser);

router.post("/adduser", requireSignin, isAdmin, addUserValidator, addUser);

router.get("/getusers", requireSignin, isAdmin, getUsers);

router.delete("/deleteuser", requireSignin, isAdmin, deleteUser);

router.get("/:userId", requireSignin, isAdmin, getUser);


router.param('userId', userById);



module.exports = router;