const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createVerificationRecord = async (email, verification_code, created_at) => {
    try {
        const [temp, createdVerificationRecord] = await prisma.$transaction([
            prisma.verifications.updateMany({
                where: {
                    email: email,
                    is_active: true
                },
                data: {
                    is_active: false
                }
            }),
            prisma.verifications.create({
                data: {
                    email: email,
                    verification_code: verification_code,
                    created_at: created_at
                }
            })
        ]);

        return createdVerificationRecord;
    } catch (err) {
        throw err;
    }
};

const getVerificationRecord = async (email) => {
    try {
        const currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes() - 2);

        const foundedVerificationRecord = await prisma.verifications.findFirst({
            where: {
                email: email,
                created_at: {
                    gte: currentDate
                },
                is_active: true
            }
        });

        return foundedVerificationRecord;
    } catch (err) {
        throw err;
    }
};

const deactiveVerificationRecord = async (id) => {
    try {
        const foundedVerificationRecord = await prisma.verifications.update({
            where: {
                id: id
            },
            data: {
                is_active: false
            }
        });

        return foundedVerificationRecord;
    } catch (err) {
        throw err;
    }
};

// Get number of verifications in last 10 minutes
const getNumberOfVerifications = async (email) => {
    try {
        const currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes() - 10);

        const tryCount = await prisma.verifications.count({
            where: {
                email: email,
                created_at: {
                    gte: currentDate
                }
            }
        });

        return tryCount;
    } catch (error) {
        throw error;
    }
};

const createWrongVerificationCodeRecord = async (email, created_at) => {
    try {
        const wrongVerificationCodeRecord = prisma.wrong_verification_code_records.create({
            data: {
                email: email,
                created_at: created_at
            }
        });

        return wrongVerificationCodeRecord;
    } catch (err) {
        throw err;
    }
};

// Get number of wrong tries for verifications in last 10 minutes
const getNumberOfWrongVerificationCodeRecord = async (email) => {
    try {
        const currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes() - 10);

        const tryCount = await prisma.wrong_verification_code_records.count({
            where: {
                email: email,
                created_at: {
                    gte: currentDate
                }
            }
        });

        return tryCount;
    } catch (err) {
        throw err;
    }
};

const createWrongPasswordLoginRecord = async (email, created_at) => {
    try {
        const record = await prisma.wrong_password_login.create({
            data: {
                email: email,
                created_at: created_at
            }
        });
    } catch (error) {
        throw error;
    }
};

const getWrongPasswordLoginRecord = async (email) => {
    try {
        const currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes() - 10);

        const tryCount = await prisma.wrong_password_login.count({
            where: {
                email: email,
                created_at: {
                    gte: currentDate
                }
            }
        });

        return tryCount;
    } catch (error) {
        throw error;
    }
};

const banUser = async (email, reason, expired_at) => {
    try {
        let bannedUser = await prisma.banned_users.create({
            data: {
                email: email,
                reason: reason,
                expired_at: new Date(Date.now() + expired_at).toISOString()
            }
        });

        return bannedUser;
    } catch (error) {
        throw error;
    }
};

const getBannedUserByEmail = async (email) => {
    try {
        const bannedUser = await prisma.banned_users.findMany({
            where: {
                email: email
            }
        });

        return bannedUser;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createVerificationRecord,
    getVerificationRecord,
    deactiveVerificationRecord,
    getNumberOfVerifications,
    createWrongVerificationCodeRecord,
    getNumberOfWrongVerificationCodeRecord,
    getWrongPasswordLoginRecord,
    createWrongPasswordLoginRecord,
    banUser,
    getBannedUserByEmail
};
