const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const {setAndSendResponse, responseError, callRes} = require('../constants/response_code');

const Event = require("../models/event.model");

const eventsController = {}

eventsController.get_list_events = expressAsyncHandler(async (req, res) => {
    const {searchBy} = req.query;

    try {
        const currentDate = new Date();

        const happeningEvents = await Event.find({
            startTime: { $lte: currentDate },
            endTime: { $gte: currentDate }
        });

        const endedEvents = await Event.find({
            endTime: { $lt: currentDate }
        });

        const happeningEventList = happeningEvents.map(event => {
            const remainingTime = event.endTime - currentDate;
            const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
            const remainingHours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

            return {
                id: event._id,
                image: event.image,
                title: event.title,
                clicks: event.clicks,
                remainingTime: `${remainingDays} ngày ${remainingHours} giờ ${remainingMinutes} phút`
            };
        });

        const endedEventList = endedEvents.map(event => {
            return {
                id: event._id,
                image: event.image,
                title: event.title,
                clicks: event.clicks,
                remainingTime: 'Đã kết thúc'
            };
        });

        const eventLists = {
            happeningEventList: happeningEventList,
            endedEventList: endedEventList
        };

        if (searchBy == null) {
            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: eventLists
                // result
            });
        } else if (searchBy == 'happening') {
            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: {
                    happeningEventList: happeningEventList
                }
                // result
            });
        } else if (searchBy == 'ended') {
            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: {
                    endedEventList: endedEventList
                }
                // result
            });
        } else if (searchBy == 'all') {
            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: eventLists
                // result
            });
        } else {
            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: eventLists
                // result
            });
        }

    } catch (err) {
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

eventsController.get_event = expressAsyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const startDate = formatDate(event.startTime);
        const endDate = formatDate(event.endTime);
        const timeRange = `${startDate} - ${endDate}`;

        const eventInfo = {
            image: event.image,
            title: event.title,
            time: timeRange,
            participationCondition: event.participationCondition,
            description: event.described,
            shortUrl: event.shortUrl
        };

        res.json(eventInfo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('vi-VN', options);
    return formattedDate.replace(/\//g, '.');
}

// API tăng click lên 1, làm sau
module.exports = eventsController;