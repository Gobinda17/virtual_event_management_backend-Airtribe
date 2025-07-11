const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../models/userSchema');
const tokenList = require('../storeBlacklistedToken.js');

class UserMiddleware {

    #verifyUser = (req, res) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: 'error',
                error: 'Unauthorized access'
            });
        }

        const token = authHeader.split(' ')[1];

        // To check for Blacklisted Token
        if (tokenList.has(token)) {
            return res.status(400).json({
                status: 'error',
                error: 'Invalid Token'
            });
        }

        const decodedUser = jwt.verify(token, JWT_SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 'fail',
                    error: `${error}`
                });
            }

            return decoded;
        });

        return decodedUser;
    };

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
            return res.status(400).json({
                message: "Internal server error",
                error: `${error}`
            });
        }
    };

    validateUser = (req, res, next) => {
        try {
            const validation = validationResult(req);

            if (!validation) {
                console.error("❌ Validation Failed");
                return res.status(400).json({ status: 'fail', message: validation.array() });
            }

            next();
        } catch (error) {
            return res.status(400).json({
                status: 'fail',
                message: `${error}`
            });
        }
    };

    verifyLogout = async (req, res, next) => {
        try {
            const verifiedUser = this.#verifyUser(req, res);

            const userExist = await User.findOne({ _id: verifiedUser.userId });

            if (!userExist) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'User invalid.'
                });
            }

            next();
        } catch (error) {
            return res.status(400).json({
                status: 'fail',
                message: `${error}`
            });
        }
    };
}

module.exports = new UserMiddleware();