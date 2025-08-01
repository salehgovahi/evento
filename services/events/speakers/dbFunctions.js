const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addSpeaker = async (event_id, name, family, position, linkedin_address, imageUrl) => {
    try {
        const addedSpeaker = await prisma.event_speakers.create({
            data: {
                event_id: event_id,
                name: name,
                family: family,
                position: position,
                linkedin_address: linkedin_address,
                image: imageUrl
            }
        });

        return addedSpeaker;
    } catch (error) {
        throw error;
    }
};

const getAllSpeakers = async (event_id) => {
    try {
        const foundedSpeakers = await prisma.event_speakers.findMany({
            where: {
                event_id: event_id
            }
        });

        return foundedSpeakers;
    } catch (error) {
        throw error;
    }
};

const speakerExists = async (user_id, event_id) => {
    try {
        const foundedSpeaker = await prisma.event_speakers.findFirst({
            where: {
                user_id: user_id,
                event_id: event_id
            }
        });

        return foundedSpeaker;
    } catch (error) {
        throw error;
    }
};

const getSpeakerById = async (speaker_id) => {
    try {
        const foundedSpeaker = await prisma.event_speakers.findFirst({
            where: {
                id: speaker_id
            }
        });

        return foundedSpeaker;
    } catch (error) {
        throw error;
    }
};

const updateSpeakerById = async (speaker_id, updateData) => {
    try {
        const updatedSpeaker = await prisma.event_speakers.update({
            where: {
                id: speaker_id
            },
            data: updateData
        });

        return updatedSpeaker;
    } catch (error) {
        throw error;
    }
};

const deleteSpeaker = async (speaker_id) => {
    try {
        const deletedSpeaker = await prisma.event_speakers.update({
            where: {
                id: speaker_id
            },
            data: {
                is_deleted: true
            }
        });

        return deletedSpeaker;
    } catch (error) {
        throw error;
    }
};

const unDeleteSpeaker = async (speaker_id) => {
    try {
        const unDeletedSpeaker = await prisma.event_speakers.update({
            where: {
                id: speaker_id
            },
            data: {
                is_deleted: false
            }
        });

        return unDeletedSpeaker;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addSpeaker,
    speakerExists,
    getAllSpeakers,
    getSpeakerById,
    updateSpeakerById,
    deleteSpeaker,
    unDeleteSpeaker
};
