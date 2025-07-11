const { validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const User = require('../models/userSchema');
const Event = require('../models/eventSchema');

// Have use a in-memory Structure to store the token
const tokenList = require('../storeTokenVerification');

class EventMiddleware {

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

    validateUserToCreateEvents = async (req, res, next) => {
        try {
            const verifiedUser = this.#verifyUser(req, res);

            const userExist = await User.findOne({ role: verifiedUser.userRole === 'organiser' ? 'organiser' : '' });
            
            if (!userExist) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'User not found with this role'
                });
            }

            req.user = verifiedUser;

            next();

        } catch (error) {
            return res.status(401).json({
                status: 'fail',
                message: `${error}`
            });
        }
    };

    duplicateEventEntry = async (req, res, next) => {
        try {
            const { title } = req.body;

            const EventExist = await Event.findOne({ title: title });

            if (EventExist) {
                return res.status(409).json({
                    status: 'fail',
                    message: 'Event already Exist.'
                });
            }

            next();

        } catch (error) {
            return res.status(409).json({
                status: 'fail',
                message: `${error}`
            });
        }
    };

    validateInputEvents = (req, res, next) => {
        try {
            const validatedResult = validationResult(req);

            if (!validatedResult) {
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
    }
}

module.exports = new EventMiddleware();