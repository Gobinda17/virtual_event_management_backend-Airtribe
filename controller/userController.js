const { validationResult } = require('express-validator');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const saltrounds = 10;

const User = require('../models/userSchema');

class UserController {

    signUp = async (req, res) => {
        try {
            const validation = validationResult(req);
            const { role } = req.params;

            if (!validationResult) {
                console.error("❌ Validation Failed");
                return res.status(400).json({ status: 'fail', message: validation.array() });
            }

            if (!['user', 'organiser'].includes(role)) {
                return res.status(400).json({ status: 'fail', message: 'Inavlid role specified' });
            }

            const { name, email, phone, password } = req.body;

            const hashPassword = await bcrypt.hash(password, saltrounds);

            const newUser = new User({
                name, email, phone, password: hashPassword, role
            });

            await newUser.save();

            return res.status(201).json({ status: 'success', message: '✅ User Created.' });

        } catch (error) {
            console.error(error);
        }
    };

    loginUser = async (req, res) => {
        try {
            console.log(req);
        } catch(error) {
            return res.status(500).json({
                status: 'fail',
                message: "Internal Server Error"
            })
        }
    }
}

module.exports = new UserController();
