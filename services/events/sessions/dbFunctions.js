const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addSession = async (event_id, title, type) => {
    try {
        const addedSession = await prisma.event_sessions.create({
            data: {
                event_id: event_id,
                title: title,
                type: type
            }
        });
        return addedSession;
    } catch (error) {
        throw error;
    }
};

const getAllSessions = async (event_id) => {
    try {
        const foundedSessions = await prisma.event_sessions.findMany({
            where: {
                event_id: event_id
            }
        });

        return foundedSessions;
    } catch (error) {
        throw error;
    }
};

const getSessionById = async (session_id) => {
    try {
        const foundedSession = await prisma.event_sessions.findFirst({
            where: {
                id: session_id
            }
        });

        return foundedSession;
    } catch (error) {
        throw error;
    }
};

const updateSessionById = async (session_id, updateData) => {
    try {
        const updatedSession = await prisma.event_sessions.update({
            where: {
                id: session_id
            },
            data: updateData
        });

        return updatedSession;
    } catch (error) {
        throw error;
    }
};

const deleteSession = async (session_id) => {
    try {
        const deletedSession = await prisma.event_sessions.update({
            where: {
                id: session_id
            },
            data: {
                is_deleted: true
            }
        });

        return deletedSession;
    } catch (error) {
        throw error;
    }
};

const unDeleteSession = async (session_id) => {
    try {
        const unDeletedSession = await prisma.event_sessions.update({
            where: {
                id: session_id
            },
            data: {
                is_deleted: false
            }
        });

        return unDeletedSession;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addSession,
    getAllSessions,
    getSessionById,
    updateSessionById,
    deleteSession,
    unDeleteSession
};
