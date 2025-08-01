const { PrismaClient } = require('@prisma/client');
const environment = require('../../../configs/environments');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');

const getAllRegisteredUsers = async (event_id, page, limit) => {
    try {
        const skip = (page - 1) * limit;
        const registeredUsers = await prisma.event_participants.findMany({
            where: {
                event_id: event_id
            },
            skip: skip,
            take: limit
        });

        const totalRegisteredUsers = await prisma.event_participants.count({
            where: {
                event_id: event_id
            }
        });
        const totalPages = Math.ceil(totalRegisteredUsers / limit);

        return {
            total: totalRegisteredUsers,
            totalPages,
            currentPage: page,
            data: registeredUsers
        };
    } catch (error) {
        throw error;
    }
};

const getParticipantById = async (participant_id, event_id) => {
    try {
        const foundedParticipant = await prisma.event_participants.findUnique({
            where: {
                id: participant_id
            }
        });

        return foundedParticipant;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllRegisteredUsers,
    getParticipantById
};
