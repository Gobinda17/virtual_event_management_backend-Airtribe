const Event = require('../models/eventSchema');

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
                message: "Event Created."
            });

        } catch (error) {
            return res.status(400).json({
                status: 'fail',
                message: `${error}`
            })
        }
    };
}

module.exports = new EventController();