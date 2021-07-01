exports.addUserValidator = (req, res, next) => {
    var regex = /^[a-zA-Z ]{2,30}$/;
    const { firstName, lastName, email, roles } = req.body;
    if (!regex.test(firstName)) {
        res.status(400).json({
            status: 400,
            message: "Invalid First Name"
        })
    }
    if (!regex.test(lastName)) {
        res.status(400).json({
            status: 400,
            message: "Invalid Last Name"
        })
    }
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@iiu.edu.pk$/.test(email)) {
        res.status(400).json({
            status: 400,
            message: "Invalid Email"
        })
    }
    if (!roles.Professor && !roles.PO && !roles.Admin) {
        res.status(400).json({
            status: 400,
            message: "Roles not defined"
        })
    }
    next();

}