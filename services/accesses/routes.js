const express = require('express');
const router = express.Router();
const accessController = require('./controller');
const validator = require('../../middlewares/joi-validator');
const accessSchema = require('./schema');

const checkAccess = require('../../middlewares/checkAccess');

// Assign Access to Role
router.post(
    '/assign',
    [validator(accessSchema.assignAccessToRole, 'body'), checkAccess],
    accessController.assignAccessToRole
);

// Get All Accesses
router.get('/', checkAccess, accessController.getAllAccesses);

// Get Access By Id
router.get(
    '/:id',
    [validator(accessSchema.getAccessById, 'params'), checkAccess],
    accessController.getAccessById
);

// Delete Access By Id
router.put(
    '/:id/delete',
    [validator(accessSchema.getAccessById, 'params'), checkAccess],
    accessController.deleteAccessById
);

// Undelete Access By Id
router.put(
    '/:id/undelete',
    [validator(accessSchema.getAccessById, 'params'), checkAccess],
    accessController.unDeleteAccessById
);

module.exports = router;
