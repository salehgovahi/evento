const HttpError = require('../../utils/httpError');
const Errors = require('../../const/errors');
const galleryController = require('./dbFunctions');

// Write a contact
const addVideo = async (req, res, next) => {
    const { category, title, email, name, context } = req.body;

    try {
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

// Get all contents
const getAllVideos = async (req, res, next) => {
    try {
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const getVideoById = async (req, res, next) => {
    try {
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const updateVideoById = async (req, res, next) => {
    try {
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const deleteVideoById = async (req, res, next) => {
    try {
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const undeleteVideoById = async (req, res, next) => {
    try {
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};
module.exports = {
    addVideo,
    getAllVideos,
    getVideoById,
    updateVideoById,
    deleteVideoById,
    undeleteVideoById
};
