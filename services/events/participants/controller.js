const fs = require('fs');
const HttpError = require('../../../utils/httpError');
const Errors = require('../../../const/errors');
const organizerDbFunctions = require('./dbFunctions');
const { sendFile } = require('../../../utils/sendRequest');
const environments = require('../../../configs/environments');
const dbFunctions = require('./dbFunctions');

const addParticipant = async (req, res, next) => {
    const event_id = req.params.event_id;

    try {
        const allRegisteredUsers = await dbFunctions.getAllRegisteredUsers(event_id, page, limit);

        res.status(201).json({
            status: 'success',
            result: allRegisteredUsers
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};
const getAllRegisteredUsers = async (req, res, next) => {
    const event_id = req.params.event_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const allRegisteredUsers = await dbFunctions.getAllRegisteredUsers(event_id, page, limit);

        res.status(200).json({
            status: 'success',
            result: allRegisteredUsers
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getParticipantById = async (req, res, next) => {
    const participant_id = req.params.participant_id;

    try {
        const registeredUser = await dbFunctions.getParticipantById(participant_id);

        res.status(200).json({
            status: 'success',
            result: registeredUser
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    addParticipant,
    getAllRegisteredUsers,
    getParticipantById
};
