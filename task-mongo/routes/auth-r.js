const express = require("express");
const authController = require("../controllers/auth-c");
const { body } = require("express-validator");
const User = require("../Models/user");

const router = express.Router();

router.get("/signup", authController.getsignup);

router.post(
  "/signup", 
  [
    body("email").isEmail().custom(async (value, {req}) => {
        const userResult = await User.findOne({email:value})
        if(userResult){
            const err = new Error('E-mail already in use'); 
            throw err;
        } 
    }),
    body("pass", "Only alphanumeric or leng must be 8 like min")
      .isAlphanumeric()
      .trim()
      .isLength({ min: 8 }),
    body("conpass").custom((value, { req }) => {
      if (value !== req.body.pass) {
        const err = new Error("Passwords must be matched!");
        throw err;
      }
      return true;
    }),
  ],
  authController.postsignup
);

router.get("/login", authController.getlogin);

router.post("/login", [
    body('email').isEmail().normalizeEmail(),
    body('pass').isAlphanumeric().isLength({min:8}).trim()
], authController.postlogin);

router.get("/logout", authController.getLogout);


module.exports = router;
