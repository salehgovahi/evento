const HttpError = require('../../utils/httpError');
const Errors = require('../../const/errors');
const feedbackController = require('./dbFunctions');

const addCourseFeedback = async (req, res, next) => {
    const course_id = req.params.course_id;
    const user_id = req.user_id;
    // const user_id = req.user_id;
    const { rate, context } = req.body;

    try {
        const addedFeedback = await feedbackController.addCourseFeedback(
            user_id,
            course_id,
            context,
            rate
        );
        if (!addedFeedback) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }

        res.status(201).json({
            status: 'success',
            result: addedFeedback
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};
const getCourseFeedback = async (req, res, next) => {
    const course_id = req.params.course_id;
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const foundedFeedbacks = await feedbackController.getCourseFeedback(course_id, page, limit);

        res.status(200).json({
            status: 'success',
            result: foundedFeedbacks
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const notConfirmedCourseFeedback = async (req, res, next) => {
    const course_id = req.params.course_id;
    try {
        const foundedNotConfirmFeedback =
            await feedbackController.notConfirmedCourseFeedback(course_id);

        res.status(200).json({
            status: 'success',
            result: foundedNotConfirmFeedback
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const deleteFeedback = async (req, res, next) => {
    const { feedback_id } = req.body;

    try {
        const foundedFeedback = await feedbackController.getFeedbackById(feedback_id);
        if (!foundedFeedback) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }

        const deleteFeedback = await feedbackController.deleteFeedbackById(feedback_id);

        res.status(200).json({
            status: 'success',
            result: deleteFeedback
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const undeleteFeedback = async (req, res, next) => {
    const { feedback_id } = req.body;

    try {
        const foundedFeedback = await feedbackController.getFeedbackById(feedback_id);
        if (!foundedFeedback) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }

        const undeleteFeedback = await feedbackController.undeleteFeedbackById(feedback_id);

        res.status(200).json({
            status: 'success',
            result: undeleteFeedback
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const updateFeedback = async (req, res, next) => {
    const { context, rate } = req.body;
    const feedback_id = req.params.feedback_id;
    try {
        const foundedFeedback = await feedbackController.getFeedbackById(feedback_id);
        if (!foundedFeedback) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }
        const updatedFeedback = await feedbackController.updateFeedbackById(
            feedback_id,
            context,
            rate
        );

        res.status(200).json({
            status: 'success',
            result: updatedFeedback
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const confirmFeedback = async (req, res, next) => {
    const { feedback_ids } = req.body;

    try {
        const confirmFeedbacks = [];
        for (let feedback_id of feedback_ids) {
            const foundedFeedback = await feedbackController.getFeedbackById(feedback_id);
            if (!foundedFeedback) {
                const error = new HttpError(Errors.Something_Went_Wrong);
                return next(error);
            }
            const confirmFeedback = await feedbackController.confirmFeedbackById(feedback_id);
            confirmFeedbacks.push(confirmFeedback);
        }

        res.status(200).json({
            status: 'success',
            result: confirmFeedbacks
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getFeedbackById = async (req, res, next) => {
    const feedback_id = req.params.feedback_id;

    try {
        const foundedFeedback = await feedbackController.getFeedbackById(feedback_id);
        if (!foundedFeedback) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            result: foundedFeedback
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getAllFeedback = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const foundedFeedbacks = await feedbackController.getAllFeedback(page, limit);

        res.status(200).json({
            status: 'success',
            result: foundedFeedbacks
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getUserCourseFeedback = async (req, res, next) => {
    const course_id = req.params.course_id;
    const user_id = req.user_id;
    try {
        const foundedFeedback = await feedbackController.getUserCourseFeedback(user_id, course_id);

        res.status(200).json({
            status: 'success',
            result: foundedFeedback
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    addCourseFeedback,
    getCourseFeedback,
    notConfirmedCourseFeedback,
    updateFeedback,
    deleteFeedback,
    undeleteFeedback,
    confirmFeedback,
    getFeedbackById,
    getAllFeedback,
    getUserCourseFeedback
};
