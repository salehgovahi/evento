const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addEvent = async (title, type, eventConfigurationFile) => {
    try {
        const createdEvent = await prisma.events.create({
            data: {
                title: title,
                type: type            }
        });
        return createdEvent;
    } catch (error) {
        throw error;
    }
};

const uploadPoster = async (event_id, poster) => {
    try {
        const updatedEvent = await prisma.events.update({
            where: {
                id: event_id
            },
            data: {
                image: poster
            }
        });
        return updatedEvent;
    } catch (error) {
        throw error;
    }
};

const uploadVideo = async (event_id, video) => {
    try {
        const updatedEvent = await prisma.events.update({
            where: {
                id: event_id
            },
            data: {
                video: video
            }
        });
        return updatedEvent;
    } catch (error) {
        throw error;
    }
};

const getAllEvent = async (page, limit) => {
    try {
        const skip = (page - 1) * limit;
        const allEvent = await prisma.events.findMany({
            skip: skip,
            take: limit
        });

        const totalEvent = await prisma.events.count({});
        const totalPages = Math.ceil(totalEvent / limit);

        return {
            total: totalEvent,
            totalPages,
            currentPage: page,
            data: allEvent
        };
    } catch (error) {
        throw error;
    }
};
const getEventById = async (event_id) => {
    try {
        const foundedEvent = await prisma.events.findFirst({
            where: {
                id: event_id
            }
        });
        return foundedEvent;
    } catch (error) {
        throw error;
    }
};

const deleteEvent = async (event_id) => {
    try {
        const deletedEvent = await prisma.events.update({
            where: {
                id: event_id
            },
            data: {
                is_deleted: true
            }
        });
        return deletedEvent;
    } catch (error) {
        throw error;
    }
};

const undeleteEvent = async (event_id) => {
    try {
        const undeletedEvent = await prisma.events.update({
            where: {
                id: event_id
            },
            data: {
                is_deleted: false
            }
        });
        return undeletedEvent;
    } catch (error) {
        throw error;
    }
};

const confrimEvent = async (event_id) => {
    try {
        const confirmedEvent = await prisma.events.update({
            where: {
                id: event_id
            },
            data: {
                is_confirm: true
            }
        });
        return confirmedEvent;
    } catch (error) {
        throw error;
    }
};

const updateEvent = async (event_id, updateData) => {
    try {
        const updatedEvent = await prisma.events.update({
            where: {
                id: event_id
            },
            data: {
                ...updateData
            }
        });
        return updatedEvent;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addEvent,
    uploadPoster,
    uploadVideo,
    getAllEvent,
    deleteEvent,
    undeleteEvent,
    confrimEvent,
    getEventById,
    updateEvent
};
