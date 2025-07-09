const { body } = require("express-validator");

const registrationValidation = [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').notEmpty().isEmail().withMessage('Email is required.' || 'Email is invalid.'),
    body('phone').notEmpty().isLength({ max: 10 }).withMessage('Phone number is required.' || 'Phone number is invalid.'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password is required.' || 'Password length must be at least 6 characters long.'),
    param('role').isIn(['user', 'organiser']).withMessage('Role must be either "user" or "organiser"')
];

module.exports = registrationValidation;