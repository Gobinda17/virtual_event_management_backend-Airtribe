const Event = require('../models/eventSchema');
const User = require('../models/userSchema');

const sendMail = require('../utils/sendMail');

class EventController {

    addEvent = async (req, res) => {
        try {
            const { title, description, date, time, location, capacity } = req.body;
            const user = req.user;

            const newEvent = new Event({
                title: title,
                description: description,
                date: date,
                time: time,
                location: location,
                capacity: capacity,
                createdBy: user.userId,
                isActice: true,
            });

            await newEvent.save();

            return res.status(200).json({
                status: 'success',
                message: "Event Created.",
                event: newEvent
            });

        } catch (error) {
            return res.status(400).json({
                status: 'fail',
                message: `${error}`
            })
        }
    };

    getEvents = async (req, res) => {
        try {
            const eventsDetails = await Event.find({});

            return res.status(200).json({
                status: 'success',
                data: eventsDetails
            });
        } catch (error) {
            return res.status(401).json({
                status: 'fail',
                message: `${error}`
            });
        }
    };

    updateEvent = async (req, res) => {
        try {
            const eventId = req.params.id;

            const toBeUpdatedData = req.body;

            const updatedEvent = await Event.findByIdAndUpdate(eventId, toBeUpdatedData, {
                new: true,
                runValidators: true,
            });

            if (!updatedEvent) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Event not found.'
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Event Updated Successfully',
                event: updatedEvent
            });
        } catch (error) {
            return res.status(401).json({
                status: 'fail',
                message: `${error}`
            });
        }
    };

    deleteEvent = async (req, res) => {
        try {
            const eventId = req.params.id;

            const deletedEvent = await Event.findByIdAndDelete(eventId);

            if (!deletedEvent) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Event not found.'
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Event Deleted Successfully'
            });

        } catch (error) {
            return res.status(401).json({
                status: 'fail',
                message: `${error}`
            });
        }
    };

    registerForAnEvent = async (req, res) => {
        try {
            const eventId = req.params.id;
            const user = req.user;

            const eventExist = await Event.findOne({ _id: eventId });
            if (!eventExist) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Event not found.'
                });
            }

            if (eventExist.participants.includes(user.userId)) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'User already registered for this event.'
                });
            }

            eventExist.participants.push(user.userId);
            await eventExist.save();

            const userExist = await User.findOne({ _id: user.userId });
            if (!userExist) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'User not found.'
                });
            }

            // Send confirmation email
            await sendMail({
                to: userExist.email,
                subject: `Registered for ${eventExist.title}`,
                text: `Hi ${userExist.name},\n\nYou've successfully registered for "${eventExist.title}" on ${eventExist.date.toDateString()} at ${eventExist.time}.`
            });

            return res.status(200).json({
                status: 'success',
                message: 'Registration Complete. Check your mail for details.'
            });

        } catch (error) {
            return res.status(401).json({
                status: 'fail',
                message: `${error}`
            });
        }
    };
}

module.exports = new EventController();