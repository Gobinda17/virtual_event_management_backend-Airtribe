

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const saltrounds = 10;

const User = require('../models/userSchema');
let tokenList = require('../storeTokenVerification.js');

class UserController {

    #generateJWT = (userId, role) => {
        return jwt.sign({ userId: userId, userRole: role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    }

    signUp = async (req, res) => {
        try {
            const { role } = req.params;

            const { name, email, phone, password } = req.body;

            const hashPassword = await bcrypt.hash(password, saltrounds);

            const newUser = new User({
                name, email, phone, password: hashPassword, role
            });

            await newUser.save();

            return res.status(201).json({ status: 'success', message: '✅ User Created.' });

        } catch (error) {
            return res.status(400).json({
                status: 'fail',
                message: `${error}`
            })
        }
    };

    loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;

            const userExist = await User.findOne({ email: email });

            if (!userExist) {
                return res.status(404).json({
                    status: 'fail',
                    message: "Eamil not found."
                });
            }

            const passwordMatch = await bcrypt.compare(password, userExist.password);

            if (!passwordMatch) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'Invalid Password.'
                });
            }

            const jsonWebToken = this.#generateJWT(userExist._id, userExist.role);

            return res.status(200).json({
                status: 'success',
                message: "Login successful.",
                token: jsonWebToken,
            });
        } catch (error) {
            return res.status(400).json({
                status: 'fail',
                message: `${error}`
            });
        }
    };

    logoutUser = async (req, res) => {
        try {
            const authHeader = req.headers.authorization;

            const token = authHeader.split(' ')[1];

            tokenList.add(token);

            return res.status(200).json({
                status: 'success',
                message: 'Logout Successfully'
            });
        } catch (error) {
            return res.status(400).json({
                status: 'fail',
                message: `${error}`
            });
        }
    };
}

module.exports = new UserController();
