const fs = require('fs');

const HttpError = require('../../../utils/httpError');
const Errors = require('../../../const/errors');

const organizerDbFunctions = require('./dbFunctions');

const { sendFile } = require('../../../utils/sendRequest');
const environments = require('../../../configs/environments');

// Create an Course
const createOrganizer = async (req, res, next) => {
    const { name } = req.body;

    try {
        const existingOrganizer = await organizerDbFunctions.getOrganizerByName(name);
        if (existingOrganizer) {
            const error = new HttpError(Errors.Organizer_Is_Duplicate);
            return next(error);
        }

        const createdOrganizer = await organizerDbFunctions.createOrganizer(name);

        res.status(201).json({
            status: 'success',
            result: createdOrganizer
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const uploadImage = async (req, res, next) => {
    const organizer_id = req.params.organizer_id;
    const imageFile = req.file;

    try {
        const foundedOrganizer = await organizerDbFunctions.getOrganizerById(organizer_id);
        if (!foundedOrganizer) {
            const error = new HttpError(Errors.Organizer_Undefined);
            return next(error);
        }

        const sendFileToFileServer = await sendFile(
            environments.FILE_SERVER_SEND_IMAGE_URL,
            imageFile.path
        );

        const updatedOrganizer = await organizerDbFunctions.uploadImage(
            organizer_id,
            sendFileToFileServer.image_url
        );

        if (!updatedOrganizer) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            result: updatedOrganizer
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getAllOrganizers = async (req, res, next) => {
    try {
        const foundedOrganizers = await organizerDbFunctions.getAllOrganizers();

        res.status(200).json({
            status: 'success',
            result: foundedOrganizers
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getOrganizerById = async (req, res, next) => {
    const organizer_id = req.params.organizer_id;

    try {
        const foundedOrganizer = await organizerDbFunctions.getOrganizerById(organizer_id);
        if (!foundedOrganizer) {
            const error = new HttpError(Errors.Organizer_Undefined);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            result: foundedOrganizer
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const updateOrganizer = async (req, res, next) => {
    const { organizer_id, name } = req.body;

    try {
        const foundedOrganizer = await organizerDbFunctions.getOrganizerById(organizer_id);
        if (!foundedOrganizer) {
            const error = new HttpError(Errors.Organizer_Undefined);
            return next(error);
        }

        const updatedOrganizer = await organizerDbFunctions.updateOrganizerById(organizer_id, name);

        res.status(200).json({
            status: 'success',
            result: updatedOrganizer
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const deleteOrganizerById = async (req, res, next) => {
    const organizer_id = req.params.organizer_id;

    try {
        const foundedOrganizer = await organizerDbFunctions.getOrganizerById(organizer_id);
        if (!foundedOrganizer) {
            const error = new HttpError(Errors.Organizer_Undefined);
            return next(error);
        }

        const deletedOrganizer = await organizerDbFunctions.deleteOrganizerById(organizer_id);

        res.status(200).json({
            status: 'success',
            result: deletedOrganizer
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const undeleteOrganizerById = async (req, res, next) => {
    const organizer_id = req.params.organizer_id;

    try {
        const foundedOrganizer = await organizerDbFunctions.getOrganizerById(organizer_id);
        if (!foundedOrganizer) {
            const error = new HttpError(Errors.Organizer_Undefined);
            return next(error);
        }

        const undeletedOrganizer = await organizerDbFunctions.undeleteOrganizerById(organizer_id);

        res.status(200).json({
            status: 'success',
            result: undeletedOrganizer
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    createOrganizer,
    uploadImage,
    getAllOrganizers,
    getOrganizerById,
    updateOrganizer,
    deleteOrganizerById,
    undeleteOrganizerById
};
