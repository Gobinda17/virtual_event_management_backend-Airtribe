const express = require('express');
const eventRouter = express.Router();

const EventMiddleware = require('../middleware/eventMiddleware');
const EventController = require('../controller/eventController');

const { eventValidation } = require('../middleware/validations');

eventRouter.post('/event', [eventValidation, EventMiddleware.validateUserToCreateEvents.bind(EventMiddleware), EventMiddleware.duplicateEventEntry.bind(EventMiddleware), EventMiddleware.validateInputEvents.bind(EventMiddleware)], EventController.addEvent.bind(EventController));

eventRouter.get('/event', [EventMiddleware.validateUserToGetEvents.bind(EventMiddleware)], EventController.getEvents.bind(EventController));

eventRouter.put('/event/:id', [eventValidation, EventMiddleware.validateUserToCreateEvents.bind(EventMiddleware), EventMiddleware.validateInputEvents.bind(EventMiddleware)], EventController.updateEvent.bind(EventController));

eventRouter.delete('/event/:id', [EventMiddleware.validateUserToCreateEvents.bind(EventMiddleware)], EventController.deleteEvent.bind(EventController));

eventRouter.post('/event/:id/register', [EventMiddleware.validateUserToGetEvents.bind(EventMiddleware)], EventController.registerForAnEvent.bind(EventController));

module.exports = eventRouter;