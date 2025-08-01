const express = require('express');
const router = express.Router();
const userController = require('./controller');
const validator = require('../../middlewares/joi-validator');
const userSchema = require('./schema');
const checkAccess = require('../../middlewares/checkAccess');

router.post(
    '/',
    [checkAccess, validator(userSchema.createUser, 'body')],
    userController.createUser
);

router.post('/compeleteinformation', checkAccess, userController.completeInformation);

router.post('/send-sms', checkAccess, userController.sendSmsToUsers);

// Get All Users
router.get('/', checkAccess, userController.getAllUsers);

// Get Users Daily Registration Count
router.get('/daily-register-count', checkAccess, userController.getUsersDailyRegistrationCount);

// Get Users Overview
router.get('/overview', checkAccess, userController.getUsersOverview);

// Search users
router.get('/search', checkAccess, userController.searchUsers);

// Get User By ID
router.get(
    '/:user_id',
    [validator(userSchema.validateUserId, 'params'), checkAccess],
    userController.getUserById
);

// Get Accesses of a User
router.get(
    '/:user_id/accesses',
    [validator(userSchema.validateUserId, 'params'), checkAccess],
    userController.getAccessesOfAUser
);

// Update User By ID
router.put(
    '/:user_id/update/',
    [validator(userSchema.validateUpdateUserPut, 'body'), checkAccess],
    userController.updateUserPut
);

// Update User By ID
router.patch(
    '/:user_id',
    [validator(userSchema.validateUpdateUserPatch, 'body'), checkAccess],
    userController.updateUserPatch
);

// Update Phone Number of User By ID
router.patch(
    '/:user_id/phone-number',
    [validator(userSchema.validateUpdatePhoneNumber, 'body'), checkAccess],
    userController.updateUserPhoneNumber
);

// Update User By ID
router.put('/setpassword', checkAccess, userController.setPassword);

// Delete User by ID
router.put('/:id/delete', checkAccess, userController.deleteUserById);

router.put('/:id/undelete', checkAccess, userController.undeleteUserById);

module.exports = router;
