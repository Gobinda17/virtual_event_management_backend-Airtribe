const { body, param } = require("express-validator");

const registrationValidation = [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').notEmpty().isEmail().withMessage('Email is required.' || 'Email is invalid.'),
    body('phone').notEmpty().isLength({ max: 10 }).withMessage('Phone number is required.' || 'Phone number is invalid.'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password is required.' || 'Password length must be at least 6 characters long.'),
    param('role').isIn(['user', 'organiser']).withMessage('Role must be either "user" or "organiser"')
];

const loginValidation = [
    body('email').isEmail().notEmpty().withMessage('Email is invalid.' || 'Email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
    param('role').isIn(['user', 'organiser']).withMessage('Role must be either "user" or "organiser')
];

const eventValidation = [
    body('title').notEmpty().withMessage('Title is reuuired.'),
    body('description').notEmpty().withMessage('Description is required.'),
    body('date').isDate().notEmpty().withMessage('Invalid Date.' || 'Date is required.'),
    body('time').notEmpty().withMessage('Time is required.'),
]

module.exports = { registrationValidation, loginValidation, eventValidation };