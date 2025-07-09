const User = require('../models/userSchema');

class UserMiddleware {

    checkExistingEmail = async (req, res, next) => {
        try {
            const { name, phone, email } = req.body;

            if (!name || !phone || !email) {
                return res.status(400).json({ status: 'fail', message: 'Necessary fields are missing.' });
            }

            const userExist = await User.findOne({ email: email, phone: phone });

            if (userExist) {
                return res.status(409).json({ status: 'fail', message: 'User already exist.' });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message
            });
        }
    }
}

module.exports = new UserMiddleware();