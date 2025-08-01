const HttpError = require('../../../utils/httpError');
const Errors = require('../../../const/errors');
const dbFunctions = require('./dbFunctions');
const userDbFunctions = require('../../users/dbFunctions');
const eventDbFunctions = require('../content/dbFunctions');

const addSession = async (req, res, next) => {
    const event_id = req.params.event_id;
    const { title, type } = req.body;

    try {
        const existingEvent = await eventDbFunctions.getEventById(event_id);
        if (!existingEvent) {
            const error = new HttpError(Errors.Event_Undefined);
            return next(error);
        }

        const addedSession = await dbFunctions.addSession(event_id, title, type);

        res.status(201).json({
            status: 'success',
            result: addedSession
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getAllSessions = async (req, res, next) => {
    const event_id = req.params.event_id;

    try {
        const existingEvent = await eventDbFunctions.getEventById(event_id);
        if (!existingEvent) {
            const error = new HttpError(Errors.Event_Undefined);
            return next(error);
        }

        const allSessions = await dbFunctions.getAllSessions(event_id);

        res.status(200).json({
            status: 'success',
            result: allSessions
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getSessionById = async (req, res, next) => {
    const session_id = req.params.session_id;

    try {
        const foundedSession = await dbFunctions.getSessionById(session_id);
        if (!foundedSession) {
            const error = new HttpError(Errors.Event_Session_Not_Defined);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            result: foundedSession
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const updateSession = async (req, res, next) => {
    const session_id = req.params.session_id;
    const { title, description, type, start_date, end_date, related_link } = req.body;

    try {
        const foundedSession = await dbFunctions.getSessionById(session_id);
        if (!foundedSession) {
            const error = new HttpError(Errors.Event_Session_Not_Defined);
            return next(error);
        }

        const updateData = {
            title: title ?? foundedSession.title,
            description: description ?? foundedSession.description,
            type: type ?? foundedSession.type,
            start_date: start_date ?? foundedSession.start_date,
            end_date: end_date ?? foundedSession.end_date,
            related_link: related_link ?? foundedSession.related_link
        };

        const updatedSession = await dbFunctions.updateSessionById(session_id, updateData);

        res.status(200).json({
            status: 'success',
            result: updatedSession
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const deleteSession = async (req, res, next) => {
    const session_id = req.params.session_id;

    try {
        const foundedSession = await dbFunctions.getSessionById(session_id);
        if (!foundedSession) {
            const error = new HttpError(Errors.Event_Session_Not_Defined);
            return next(error);
        }

        const deletedSession = await dbFunctions.deleteSession(session_id);

        res.status(200).json({
            status: 'success',
            result: deletedSession
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const unDeleteSession = async (req, res, next) => {
    const session_id = req.params.session_id;

    try {
        const foundedSession = await dbFunctions.getSessionById(session_id);
        if (!foundedSession) {
            const error = new HttpError(Errors.Event_Session_Not_Defined);
            return next(error);
        }

        const unDeletedSession = await dbFunctions.unDeleteSession(session_id);

        res.status(200).json({
            status: 'success',
            result: unDeletedSession
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    addSession,
    getAllSessions,
    getSessionById,
    updateSession,
    deleteSession,
    unDeleteSession
};
