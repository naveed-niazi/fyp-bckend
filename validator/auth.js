const { batches, departments } = require('../resources/data');

exports.userSignupValidator = (req, res, next) => {
            
      //First Name Validation
      req.check("fname", "First name required!").notEmpty();
      req.check("fname", "First name must be in between 3 to 20 characters")
            .matches(/^[A-Z][a-zA-Z]*$/)
            .withMessage("First Letter must be capital / no special characters allowed!")
            .isLength({ min: 3, max: 20 });
    
       //Last Name Validation
      req.check("lname", "Last name required!").notEmpty();
      req.check("lname", "Last name must be in between 3 to 20 characters")
            .matches(/^[A-Z][a-zA-Z]*$/)
            .withMessage("First Letter must be capital / no special characters allowed!")
            .isLength({ min: 3, max:20 });

      //Email is not null, valid and normalized
      req.check("email", "Email required!").notEmpty();
      req.check("email", "Email must be between 3 to 32 characters")
            .matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@iiu.edu.pk$/)
            .withMessage("Invalid Email Address")
            .isLength({
                  min: 4,
                  max: 32
            })
      
      //check for password
      //Minimum eight characters, at least one letter and one number
      //No special characters are allowed
      req.check("password", "Password is required").notEmpty();
      req.check("password")
            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
            .withMessage("Password must contain minimum eight characters, at least one letter and one number.(no special characters are allowed)");
      
      //check for registration number
      req.check("student_details.regNo", "Registration number is required").notEmpty();
      req.check("student_details.regNo")
            .matches(/^[0-9]{4}$/)
            .withMessage("Only 4 digits are allowed");
      
      //check for department
      req.check("department", "Department is required").notEmpty();
      if (!departments.includes(req.body.department)){
            return res.status(400).json({error: "Department does not exist"})
      }

      //check for batch
        req.check("student_details.batch", "Batch is required").notEmpty();
      if (!batches.includes(req.body.student_details.batch)){
            return res.status(400).json({error: "Batch does not exist"})
      }
      
      
      //check for errors
      const errors = req.validationErrors()
      //if erro show the first one as they happen
      if (errors) {
            const firstError = errors.map((error) => error.msg)[0]
            return res.status(400).json({ error: firstError })
      }
   //   proceed to next middleware
      next();

}
