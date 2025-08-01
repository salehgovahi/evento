const HttpError = require('../../../utils/httpError');
const Errors = require('../../../const/errors');
const dbFunctions = require('./dbFunctions');
const userDbFunctions = require('../../users/dbFunctions');
const eventDbFunctions = require('../content/dbFunctions');
const { sendRequest } = require('../../../utils/sendRequest');
const environments = require('../../../configs/environments');

const addSpeakers = async (req, res, next) => {
    const event_id = req.params.event_id;
    const { family, name, position, linkedin_address } = req.body;
    const image = req.file;

    try {
        const existingEvent = await eventDbFunctions.getEventById(event_id);
        if (!existingEvent) {
            const error = new HttpError(Errors.Event_Undefined);
            return next(error);
        }

        let imageUrl;
        if (image) {
            const sendFileToFileServer = await sendRequest(
                environments.FILE_SERVER_SEND_IMAGE_URL,
                image.path
            );
            imageUrl = sendFileToFileServer.image_url;
        }        

        const addedSpeaker = await dbFunctions.addSpeaker(event_id, name, family, position, linkedin_address, imageUrl);

        res.status(201).json({
            status: 'success',
            result: addedSpeaker
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getAllSpeakers = async (req, res, next) => {
    const event_id = req.params.event_id;

    try {
        const existingEvent = await eventDbFunctions.getEventById(event_id);
        if (!existingEvent) {
            const error = new HttpError(Errors.Event_Undefined);
            return next(error);
        }

        const allSpeakers = await dbFunctions.getAllSpeakers(event_id);

        res.status(200).json({
            status: 'success',
            result: allSpeakers
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getSpeakerById = async (req, res, next) => {
    const speaker_id = req.params.speaker_id;

    try {
        const foundedSpeaker = await dbFunctions.getSpeakerById(speaker_id);
        if (!foundedSpeaker) {
            const error = new HttpError(Errors.Event_Speaker_Not_Defined);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            result: foundedSpeaker
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const updateSpeaker = async (req, res, next) => {
    const speaker_id = req.params.speaker_id;
    const { position, linkedin_address, related_session, is_deleted } = req.body;

    try {
        const foundedSpeaker = await dbFunctions.getSpeakerById(speaker_id);
        if (!foundedSpeaker) {
            const error = new HttpError(Errors.Event_Speaker_Not_Defined);
            return next(error);
        }

        const updateData = {
            position: position ?? foundedSpeaker.position,
            linkedin_address: linkedin_address ?? foundedSpeaker.linkedin_address,
            related_session: related_session ?? foundedSpeaker.related_session,
            is_deleted: is_deleted ?? foundedSpeaker.is_deleted
        };

        const updatedSpeaker = await dbFunctions.updateSpeakerById(speaker_id, updateData);

        res.status(200).json({
            status: 'success',
            result: updatedSpeaker
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const deleteSpeaker = async (req, res, next) => {
    const speaker_id = req.params.speaker_id;

    try {
        const foundedSpeaker = await dbFunctions.getSpeakerById(speaker_id);
        if (!foundedSpeaker) {
            const error = new HttpError(Errors.Event_Speaker_Not_Defined);
            return next(error);
        }

        const deletedSpeaker = await dbFunctions.deleteSpeaker(speaker_id);

        res.status(200).json({
            status: 'success',
            result: deletedSpeaker
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const unDeleteSpeaker = async (req, res, next) => {
    const speaker_id = req.params.speaker_id;

    try {
        const foundedSpeaker = await dbFunctions.getSpeakerById(speaker_id);
        if (!foundedSpeaker) {
            const error = new HttpError(Errors.Event_Speaker_Not_Defined);
            return next(error);
        }

        const unDeletedSpeaker = await dbFunctions.unDeleteSpeaker(speaker_id);

        res.status(200).json({
            status: 'success',
            result: unDeletedSpeaker
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    addSpeakers,
    getAllSpeakers,
    getSpeakerById,
    updateSpeaker,
    deleteSpeaker,
    unDeleteSpeaker
};
