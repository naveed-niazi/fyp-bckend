const express = require("express");

const { initializeConnection, firstTimeCreation, getItem, addNewBatch, addNewDegree , addNewChairman, getSignupInfo} = require("../controllers/setting")


const router = express.Router();

//router.post("/initializesettings", initializeConnection, firstTimeCreation)

router.get("/systemsettings", initializeConnection, getItem)
router.post("/systemsettings/newbatch", initializeConnection, addNewBatch)
router.post("/systemsettings/newprogram", initializeConnection, addNewDegree)
router.put("/systemsettings/chairman", initializeConnection, addNewChairman)
router.get("/systemsettings/signup", initializeConnection, getSignupInfo)

module.exports = router;

