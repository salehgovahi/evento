const express = require('express');
const router = express.Router();
const roleController = require('./controller');
const validator = require('../../middlewares/joi-validator');
const roleSchema = require('./schema');
const checkAccess = require('../../middlewares/checkAccess');

// Create Role
router.post(
    '/create',
    [validator(roleSchema.validateRoleName, 'body'), checkAccess],
    roleController.createRole
);

// Get All Roles
router.get('/', checkAccess, roleController.getAllRoles);

// Get Role By ID
router.get(
    '/:id',
    [validator(roleSchema.validateRoleId, 'params'), checkAccess],
    roleController.getRoleById
);

// Get Accesses Of a Role
router.get(
    '/:id/accesses',
    [validator(roleSchema.validateRoleId, 'params'), checkAccess],
    roleController.getAccessesOfARole
);

// Assign Role to User
router.post('/assign', checkAccess, roleController.assignRoleToUser);

// Update Role (Name Only)
router.put('/:id/update', checkAccess, roleController.updateRole);

// Delete Role By ID
router.put('/:id/delete', [checkAccess], roleController.deleteRoleById);

router.put('/:id/undelete', [checkAccess], roleController.undeleteRoleById);

module.exports = router;
