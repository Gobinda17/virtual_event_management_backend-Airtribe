const express = require('express');
const eventRouter = express.Router();

const EventMiddleware = require('../middleware/eventMiddleware');
const EventController = require('../controller/eventController');

const { eventValidation } = require('../middleware/validations');

eventRouter.post('/event', [eventValidation, EventMiddleware.validateUserToCreateEvents.bind(EventMiddleware), EventMiddleware.duplicateEventEntry.bind(EventMiddleware), EventMiddleware.validateInputEvents.bind(EventMiddleware)], EventController.addEvent.bind(EventController));
eventRouter.post('/event/:id', (req, res) => {

});

module.exports = eventRouter;