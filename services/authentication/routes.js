const express = require('express');
const router = express.Router();
const authControllers = require('./controller');
const validator = require('../../middlewares/joi-validator');
const authSchema = require('./schema');

// Send verification code
router.post(
    '/sendcode',
    [validator(authSchema.sendCode, 'body')],
    authControllers.sendVerificationCode
);

// Verify sent verification code
router.post('/verify', validator(authSchema.signup_confirm, 'body'), authControllers.verifyCode);

module.exports = router;
