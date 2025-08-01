const express = require('express');
const router = express.Router();
const contactUsController = require('./controller');
const validator = require('../../middlewares/joi-validator');
const checkAccess = require('../../middlewares/checkAccess')
const contactUsSchema = require('./schema');

// Create a contact
router.post(
    '/write',
    validator(contactUsSchema.validateContact, 'body'),
    contactUsController.writeContact
);

// Get all contacts
router.get('/', [checkAccess], contactUsController.getAllContact);

// Answer a contact
router.post(
    '/:contact_id',
    [validator(contactUsSchema.answeringContact, 'body'), checkAccess],
    contactUsController.answerContactById
);

module.exports = router;
