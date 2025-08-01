const fs = require('fs');
const HttpError = require('../../../utils/httpError');
const Errors = require('../../../const/errors');
const organizerDbFunctions = require('./dbFunctions');
const { sendFile } = require('../../../utils/sendRequest');
const environments = require('../../../configs/environments');
const dbFunctions = require('./dbFunctions');
const { generateTicketPdf } = require('../../../utils/pdfTicket');
const path = require('path');

const generateTicket = async (req, res, next) => {
    try {
        const { eventDetails, employeeDetails } = req.body;
        const ticketPdfPath = await generateTicketPdf(eventDetails, employeeDetails);
        res.sendFile(path.resolve(ticketPdfPath), (err) => {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            } else {
                // Optionally, you can remove the file after sending it
            }
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    generateTicket
};
