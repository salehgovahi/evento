const HttpError = require('../../../utils/httpError');
const Errors = require('../../../const/errors');
const { sendRequest } = require('../../../utils/sendRequest');
const environments = require('../../../configs/environments');
const reduceLink = require('../../../utils/reduceLink');

const dbFunctions = require('./dbFunctions');

const addEvent = async (req, res, next) => {
    const { title, type } = req.body;
    try {
        const createEvent = await dbFunctions.addEvent(title, type);

        res.status(200).json({
            status: 'success',
            result: createEvent
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const uploadPoster = async (req, res, next) => {
    const poster = req.file;
    const event_id = req.params.event_id;

    try {
        const foundedEvent = await dbFunctions.getEventById(event_id);
        if (!foundedEvent) {
            const error = new HttpError(Errors.Event_Undefined);
            return next(error);
        }

        const sendFileToFileServer = await sendRequest(
            environments.FILE_SERVER_SEND_IMAGE_URL,
            poster.path
        );

        const updatedEvent = await dbFunctions.uploadPoster(
            event_id,
            sendFileToFileServer.image_url
        );

        res.status(201).json({
            status: 'success',
            result: updatedEvent
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const uploadVideo = async (req, res, next) => {
    const video = req.file;
    const event_id = req.params.event_id;

    try {
        const foundedEvent = await dbFunctions.getEventById(event_id);
        if (!foundedEvent) {
            const error = new HttpError(Errors.Event_Undefined);
            return next(error);
        }

        const sendFileToFileServer = await sendRequest(
            environments.FILE_SERVER_SEND_VIDEO_URL,
            video.path
        );

        const updatedEvent = await dbFunctions.uploadVideo(
            event_id,
            sendFileToFileServer.video_url
        );

        res.status(200).json({
            status: 'success',
            result: updatedEvent
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getAllEvent = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const AllEvent = await dbFunctions.getAllEvent(page, limit);

        res.status(200).json({
            status: 'success',
            result: AllEvent
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};
const getEventById = async (req, res, next) => {
    const event_id = req.params.event_id;

    try {
        const foundedEvent = await dbFunctions.getEventById(event_id);
        if (!foundedEvent) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }

        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        //const reducedLink = await reduceLink.generateReducedLink(fullUrl)

        //console.log(reducedLink);

        res.status(200).json({
            status: 'success',
            result: foundedEvent
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};
const deleteEvent = async (req, res, next) => {
    try {
        const event_id = req.params.event_id;
        const foundedEvent = await dbFunctions.getEventById(event_id);
        if (!foundedEvent) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }
        const deletedEvent = await dbFunctions.deleteEvent(event_id);

        res.status(200).json({
            status: 'success',
            result: deletedEvent
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const undeleteEvent = async (req, res, next) => {
    try {
        const event_id = req.params.event_id;
        const foundedEvent = await dbFunctions.getEventById(event_id);
        if (!foundedEvent) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }
        const deletedEvent = await dbFunctions.deleteEvent(event_id);

        res.status(200).json({
            status: 'success',
            result: deletedEvent
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const confirmEvent = async (req, res, next) => {
    try {
        const events_id = req.body.events_id;
        confrimedEvents = [];
        for (let event_id of events_id) {
            const confirmedEvent = await dbFunctions.confrimEvent(event_id);
            confrimedEvents.push(confirmedEvent);
        }
        res.status(200).json({
            status: 'success',
            result: confrimedEvents
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const updateEventPut = async (req, res, next) => {
    const event_id = req.params.event_id;
    const {
        title,
        description,
        image,
        start_registration,
        end_registratoin,
        start_time,
        end_time,
        latitude,
        longitude,
        capacity
    } = req.body;
    try {
        const foundedEvent = await dbFunctions.getEventById(event_id);
        if (!foundedEvent) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }
        const updatedEvent = await dbFunctions.updateEvent(
            event_id,
            title,
            description,
            image,
            start_registration,
            end_registratoin,
            start_time,
            end_time,
            latitude,
            longitude,
            capacity
        );

        res.status(200).json({
            status: 'success',
            result: updatedEvent
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const updateEventPatch = async (req, res, next) => {
    const event_id = req.params.event_id;
    const {
        title,
        type,
        introduction,
        description,
        image,
        video,
        features,
        start_registration,
        end_registration,
        start_time,
        end_time,
        latitude,
        longitude,
        capacity,
        configuration,
        link
    } = req.body;

    try {
        const foundedEvent = await dbFunctions.getEventById(event_id);
        if (!foundedEvent) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }

        const updateData = {
            title: title ?? foundedEvent.title,
            type: type ?? foundedEvent.type,
            introduction: introduction ?? foundedEvent.introduction,
            description: description ?? foundedEvent.description,
            image: image ?? foundedEvent.image,
            video: video ?? foundedEvent.video,
            features: features ?? foundedEvent.features,
            start_registration: start_registration ?? foundedEvent.start_registration,
            end_registration: end_registration ?? foundedEvent.end_registration,
            start_time: start_time ?? foundedEvent.start_time,
            end_time: end_time ?? foundedEvent.end_time,
            latitude: latitude ?? foundedEvent.latitude,
            longitude: longitude ?? foundedEvent.longitude,
            capacity: capacity ?? foundedEvent.capacity,
            configuration: configuration ?? foundedEvent.configuration,
            link: link ?? foundedEvent.link
        };

        const updatedEvent = await dbFunctions.updateEvent(event_id, updateData);

        res.status(200).json({
            status: 'success',
            result: updatedEvent
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const addOrganizeToEvent = async (req, res, next) => {
    try {
        const events_id = req.body.events_id;
        confrimedEvents = [];
        for (let event_id of events_id) {
            const confirmedEvent = await dbFunctions.confrimEvent(event_id);
            confrimedEvents.push(confirmedEvent);
        }
        res.status(200).json({
            status: 'success',
            result: confrimedEvents
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    addEvent,
    uploadPoster,
    uploadVideo,
    getAllEvent,
    deleteEvent,
    undeleteEvent,
    confirmEvent,
    updateEventPut,
    updateEventPatch,
    getEventById
};
