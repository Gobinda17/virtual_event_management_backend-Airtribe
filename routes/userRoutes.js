const express = require("express");
const router = express.Router();

const UserController = require('../controller/userController');
const UserMiddleware = require('../middleware/userMiddleware');

router.post("/register/:role", [UserMiddleware.checkExistingEmail.bind(UserMiddleware)], UserController.signUp.bind(UserController));

router.post("/login/:role", UserController.loginUser.bind(UserController));

module.exports = router;
