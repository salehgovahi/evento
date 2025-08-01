const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (registerData) => {
    try {
        const registeredUser = await prisma.event_participants.create({
            data: {
                ...registerData
            }
        });

        return registeredUser;
    } catch (err) {
        throw err;
    }
};

const updateRegister = async (event_id, user_id, registerData) => {
    try {
        const registeredUser = await prisma.event_participants.update({
            where: {
                event_id: event_id,
                user_id: user_id
            },
            data: {
                ...registerData
            }
        });

        return registeredUser;
    } catch (err) {
        throw err;
    }
};

const completeRegistration = async (participant_id) => {
    try {
        const registeredUser = await prisma.event_participants.update({
            where: {
                id: participant_id
            },
            data: {
                completed_register: true
            }
        });

        return registeredUser;
    } catch (err) {
        throw err;
    }
};
const getRegisterByUserId = async (eventId, userId) => {
    try {
        const foundedRegister = await prisma.event_participants.findFirst({
            where: {
                event_id: eventId,
                user_id: userId
            }
        });

        return foundedRegister;
    } catch (err) {
        throw err;
    }
};

const uploadCV = async (participant_id, cvUrl) => {
    try {
        const uploadedCV = await prisma.event_participants.update({
            where: {
                id: participant_id
            },
            data: {
                cv: cvUrl
            }
        });

        return uploadedCV;
    } catch (err) {
        throw err;
    }
};

const uploadMotivationLetter = async (participant_id, motivationLetterUrl) => {
    try {
        const uploadedMotivationLetter = await prisma.event_participants.update({
            where: {
                id: participant_id
            },
            data: {
                motivation_letter: motivationLetterUrl
            }
        });

        return uploadedMotivationLetter;
    } catch (err) {
        throw err;
    }
};

const uploadChallenge = async (participant_id, challengeUrl) => {
    try {
        const uploadedChallenge = await prisma.event_participants.update({
            where: {
                id: participant_id
            },
            data: {
                challenge: challengeUrl
            }
        });

        return uploadedChallenge;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    register,
    updateRegister,
    getRegisterByUserId,
    completeRegistration,
    uploadCV,
    uploadMotivationLetter,
    uploadChallenge
};
