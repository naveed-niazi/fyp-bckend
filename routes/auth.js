const express = require("express");
const {
      signup,
      verifyUser,
      deleteUser,
      signin,
      signout,
      forgotPassword,
      resetPassword,
      newPassword
} = require("../controllers/auth");
const { userSignupValidator } = require('../validator/auth');
//const { userById } = require("../controllers/user");

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.get("/confirm/:confirmationCode", verifyUser);
router.get("/delete/:confirmationCode", deleteUser);
router.post('/signin', signin);
router.put('/forgot-password', forgotPassword)
router.get('/reset-password/:resetCode', resetPassword)
router.put('/reset-password/:resetCode',newPassword)

// router.post("/signin", signin);
 router.get("/signout", signout);

// //any route containing :userId, our app will first execute userByID()
// router.param("userId", userById);
module.exports = router;