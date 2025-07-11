const express = require("express");
const router = express.Router();

const UserController = require('../controller/userController');
const UserMiddleware = require('../middleware/userMiddleware');

const { registrationValidation, loginValidation } = require('../middleware/validations');

router.post("/register/:role", [registrationValidation, UserMiddleware.checkExistingEmail.bind(UserMiddleware), UserMiddleware.validateUser.bind(UserMiddleware)], UserController.signUp.bind(UserController));

router.post("/login/:role", [loginValidation, UserMiddleware.validateUser.bind(UserMiddleware)], UserController.loginUser.bind(UserController));

router.post("/logout", [UserMiddleware.verifyLogout.bind(UserMiddleware)], UserController.logoutUser.bind(UserController));

module.exports = router;
