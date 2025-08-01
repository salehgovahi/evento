const HttpError = require('../../utils/httpError');
const Errors = require('../../const/errors');
const dbFunctions = require('./dbFunctions');
const sendNotification = require('../../utils/sendNotification');

// Write a contact
const writeContact = async (req, res, next) => {
    const { category, title, email, name, context } = req.body;

    try {
        const createContact = await dbFunctions.writeContact(category, title, email, name, context);
        if (!createContact) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }

        res.status(201).json({
            status: 'success',
            result: createContact
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

// Get all contents
const getAllContact = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const foundedContact = await dbFunctions.getAllContact(page, limit);

        res.status(200).json({
            status: 'success',
            result: foundedContact
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const answerContactById = async (req, res, next) => {
    const contact_id = req.params.contact_id;
    const user_id = req.user_id;
    const { answer, send_email } = req.body;

    try {
        const existingContact = await dbFunctions.getContactById(contact_id);
        if (!existingContact) {
            const error = new HttpError(Errors.Contact_Not_Found);
            return next(error);
        }

        const answeredContact = await dbFunctions.answerContactById(
            contact_id,
            answer,
            new Date(Date.now()).toISOString(),
            user_id
        );

        if (send_email) {
            const { notification, recipient } = await sendNotification.sendNotification({
                templateCode: 'REPLY_COMMENT',
                type: 'PERSONAL',
                meta: {
                    user_id: user_id
                },
                recipientUserId: user_id
            });

            await sendNotification.addChannelStatus({
                notification: notification,
                recipientId: recipient.id,
                channel: 'EMAIL',
                status: 'SENT',
                receiver: answeredContact.email
            });
        }

        res.status(200).json({
            status: 'success',
            result: answeredContact
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    writeContact,
    getAllContact,
    answerContactById
};
