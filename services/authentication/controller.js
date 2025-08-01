const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const userController = require('../users/dbFunctions');
const authController = require('./dbFunctions');
const staticVariables = require('../../const/staticVariables');
const HttpError = require('../../utils/httpError');
const Errors = require('../../const/errors');
const roleController = require('../roles/dbFunctions');
const getCurrentTime = require('../../utils/timeUtil');
const config = require('../../configs/environments');
const { sendSms } = require('../../utils/sendSms');
const { metrics } = require('../../utils/telemetry');
const sendEmail = require('../../utils/sendEmail');
const sendVerificationHtml = require('../../htmlTemplates/sendVerification');

const sendVerificationCode = async (req, res, next) => {
    const { email } = req.body;

    try {
        // Check if phoneNumber is Banned
        const isBanned = await checkIfPhoneNumberIsBanned(email);
        if (isBanned) {
            const error = new HttpError(Errors.User_Is_Banned);
            return next(error);
        }

        // Check that not send more than 1 code in 2 minutes
        const existingVerificationRecord = await authController.getVerificationRecord(email);
        if (existingVerificationRecord) {
            const error = new HttpError(Errors.Existing_Active_Verification_Code);
            return next(error);
        }

        // Check User Has Sent Many Requests
        if ((await authController.getNumberOfVerifications(email)) >= 5) {
            metrics.bannedUserCounter.add(1, {
                email: email,
                method: 'POST',
                url: req.originalUrl,
                reason: 'Too_Many_Requests'
            });
            metrics.failedLogins.add(1, {
                email: email,
                url: req.originalUrl,
                type: 'Too_Many_Requests'
            });
            await authController.banUser(
                email,
                'Send Verification Code',
                staticVariables.BAN_TIME_SIGNUP
            );
            const error = new HttpError(Errors.Too_Many_Requests);
            return next(error);
        }

        // Generate Verification Code Randomly
        const verification_code = Math.floor(10000 + Math.random() * 90000);

        // Send Verification code
        try {
            await sendEmail(email, 'Verify Your Email', sendVerificationHtml, verification_code);
            metrics.sendEmailCounter.add(1, {
                email: email,
                url: req.originalUrl
            });
        } catch (err) {
            const error = new HttpError(Errors.SMS_Service_Error);
            return next(error);
        }

        await authController.createVerificationRecord(
            email,
            verification_code,
            new Date(Date.now()).toISOString()
        );

        let result = {};
        result['remaining_time'] = staticVariables.EXPIRE_TIME_CONFIRM_SIGNUP / 1000;

        res.status(200).json({
            status: 'success',
            result: result
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const verifyCode = async (req, res, next) => {
    const { email, verification_code } = req.body;

    try {
        // Check if phoneNumber is Banned
        const isBanned = await checkIfPhoneNumberIsBanned(email);
        if (isBanned) {
            const error = new HttpError(Errors.User_Is_Banned);
            return next(error);
        }

        // Check Entered Verification Code is Correct
        const existingVerificationRecord = await authController.getVerificationRecord(email);

        if (existingVerificationRecord) {
            // Check Entered Code is the Same As Code In Database
            if (existingVerificationRecord.verification_code != verification_code) {
                await authController.createWrongVerificationCodeRecord(
                    email,
                    new Date(Date.now()).toISOString()
                );
                if (
                    (await authController.getNumberOfWrongVerificationCodeRecord(email)) >= 5
                ) {
                    await authController.banUser(
                        email,
                        'Wrong Verification Code',
                        staticVariables.BAN_TIME_SIGNUP
                    );

                    metrics.bannedUserCounter.add(1, {
                        email: email,
                        url: req.originalUrl,
                        reason: 'Too_Many_Requests'
                    });
                }
                metrics.failedLogins.add(1, {
                    email: email,
                    url: req.originalUrl,
                    error_type: 'Invalid_Verify_Code'
                });

                const error = new HttpError(Errors.Invalid_Verify_Code);
                return next(error);
            }
        } else {
            const error = new HttpError(Errors.Verfication_Code_Not_Exist);
            return next(error);
        }

        //Check Code is not Expired
        const verificationCodeCreatedAt = Math.floor(
            new Date(existingVerificationRecord.created_at).getTime() / 1000
        );
        if (getCurrentTime() - 60 * 2 > verificationCodeCreatedAt) {
            metrics.failedLogins.add(1, {
                email: email,
                url: req.originalUrl,
                type: 'Expiration_Verify_Code'
            });
            const error = new HttpError(Errors.Expiration_Verify_Code);
            return next(error);
        }

        // Deactivate verification code after using it
        await authController.deactiveVerificationRecord(existingVerificationRecord.id);

        // Check if phone number is signed before
        const existingUser = await userController.getUserByEmail(email);

        let result;
        if (existingUser) {
            // If user exists, login
            metrics.loginCounter.add(1, { email: email });
            result = await loginWithVerificationCode(existingUser);
        } else {
            // If user not exists, signup
            metrics.signupCounter.add(1, { email: email });
            result = await signup(email);
        }

        res.status(200).json({
            status: 'success',
            result: result
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const loginWithVerificationCode = async (existingUser) => {
    try {
        const result = await getUserDataAfterLogin(existingUser.id, existingUser.email);

        return result;
    } catch (err) {
        throw err;
    }
};

const signup = async (email) => {
    try {
        // Get Role Information
        let existingRole = await roleController.getRoleByName('participant');
        if (!existingRole) {
            const error = new HttpError(Errors.Role_Undefined);
            throw error;
        }

        // Create User
        let createdUser = await userController.createUser(email);

        // Assign Role to User
        await roleController.assignRoleToUser(createdUser.id, [existingRole.id]);

        const result = getUserDataAfterLogin(createdUser.id, email);

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const getUserDataAfterLogin = async (user_id, email) => {
    try {
        // Get all roles assigned to the user
        let existingRoles = await userController.getRoleOfUser(user_id);
        const role = await roleController.getRoleById(existingRoles[0]?.role_id);
        if (!existingRoles || existingRoles.length === 0) {
            const error = new HttpError(Errors.Role_Undefined);
            throw error;
        }

        // Generate Token that contains user_id and email
        const token = jwt.sign(
            {
                user_id: user_id,
                email: email,
                role: role?.name || ''
            },
            config.JWT_SECRET_KEY,
            {
                expiresIn: '30d' // Set expiration time to 30 days (1 month)
            }
        );

        let accessNames = [];

        for (let role of existingRoles) {
            const accessNameOfRole = await roleController.getAccessNameOfARole(role.role_id);
            accessNames = accessNames.concat(accessNameOfRole);
        }

        const uniqueAccessNames = [...new Set(accessNames)];

        const user = await userController.getUserById(user_id);

        const result = {
            status: 'success',
            user_id: user_id,
            name: user.name,
            family: user.family,
            image: user.image,
            accesses: uniqueAccessNames,
            token: token
        };

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/////////////////////////////////////////////////////////////////////////////////

const checkIfPhoneNumberIsBanned = async (email) => {
    let result = false;
    let existingBannedUser = await authController.getBannedUserByEmail(email);
    if (existingBannedUser) {
        for (let bannedUser of existingBannedUser) {
            const banExpireTime = Math.floor(new Date(bannedUser.expired_at).getTime() / 1000);

            const currentTime = getCurrentTime();

            if (currentTime < banExpireTime) {
                result = true;
            }
        }
    }
    return result;
};

module.exports = {
    sendVerificationCode,
    verifyCode
};
