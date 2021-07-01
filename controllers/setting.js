const storage = require('node-persist');


exports.initializeConnection = async (req, res, next) => {
    await storage.init({
        dir: './variables/settingData',

        stringify: JSON.stringify,

        parse: JSON.parse,

        encoding: 'utf8',

        logging: false,  // can also be custom logging function

        ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object
        // every 2 minutes the process will clean-up the expired cache

        // in some cases, you (or some other service) might add non-valid storage files to your
        // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
        forgiveParseErrors: false

    })
    next()
}

exports.firstTimeCreation = async (req, res) => {
    //creating user
    console.log("Creating Storage")
    await storage.setItem("mainSetting", {
        Batches: ["F16", "F17", "F18", "F19", "F20"],
        Degrees: ["BSCS", "BSSE", "BSIT", "MSCS", "MIT"],
        Departments: ["FBAS"],
        Chairman: {
            name: "Asim Munir",
            Appointed: new Date(Date.parse("2020-04-30T02:15:12.356Z"))
        }
    })
    return res.status(200).json({ message: "Initialization of data is done" })

}
exports.getItem = async (req, res) => {
    const setting = await storage.getItem("mainSetting")
    return res.status(200).json(setting)
}
exports.addNewBatch = async (req, res) => {
    const setting = await storage.getItem("mainSetting")
    //now we have the settings
    console.log(req.body)
    console.log(req.body.batch)

    const batch = req.body.batch;
    if (setting.Batches.includes(batch)) {
        return res.status(400).json({ error: "Batch Already Exists" });
    }
    setting.Batches.push(batch)
    console.log(setting.Batches)
    await storage.setItem("mainSetting", setting)
    return res.status(200).json({ message: "New Batch Added" })
}
exports.addNewDegree = async (req, res) => {

    const newDegree = req.body.newDegree
    const setting = await storage.getItem("mainSetting")
    if (setting.Degrees.includes(newDegree)) {
        return res.status(400).json({ error: "Degree Already Exists" });
    }
    setting.Degrees.push(newDegree)
    console.log(setting.Degrees)
    await storage.setItem("mainSetting", setting)
    return res.status(200).json({ message: "New Degree Added" })
}
exports.addNewChairman = async (req, res) => {

    //console.log(req.body)
    const setting = await storage.getItem("mainSetting")
    setting.Chairman = req.body
    console.log(setting.Chairman)
    await storage.setItem("mainSetting", setting)
    return res.status(200).json({ message: "Chairman Updated" })
}

exports.getSignupInfo = async (req, res) => {
    //We need to send degrees and batches
    const setting = await storage.getItem("mainSetting")
    console.log(setting)
    if (setting.Degrees && setting.Batches) {
        return res.status(200).json({ degrees: setting.Degrees, batches: setting.Batches })
    } else {
        return res.status(200).json({ degrees: [], batches: [] })
    }
}