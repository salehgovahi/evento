const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validator = require('../../../middlewares/joi-validator');
const templateSchema = require('./schema');
const checkAccess = require('../../../middlewares/checkAccess');

// Add a template
router.post(
    '/',
    [validator(templateSchema.addTemplate, 'body'), checkAccess],
    controller.addTemplate
);

// Get all templates
router.get('/', checkAccess, controller.getAllTemplates);

// Get templates by id
router.get('/:template_id', checkAccess, controller.getTemplateById);

// Update template by id
router.patch(
    '/:template_id',
    [validator(templateSchema.updateTemplate, 'body'), checkAccess],
    controller.updateTemplateById
);

// Delete template by id
router.delete('/:template_id', checkAccess, controller.deleteTemplateById);

// Undelete template by id
router.put('/:template_id/undelete', checkAccess, controller.undeleteTemplateById);

module.exports = router;
