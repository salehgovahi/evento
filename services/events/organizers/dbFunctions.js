const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOrganizer = async (name) => {
    try {
        const createdOrganizer = await prisma.organizers.create({
            data: {
                name: name,
                logo: ''
            }
        });

        return createdOrganizer;
    } catch (error) {
        throw error;
    }
};

const uploadImage = async (organizerId, imagePath) => {
    try {
        const updatedCourse = await prisma.organizers.update({
            where: {
                id: organizerId
            },
            data: {
                logo: imagePath
            }
        });

        return updatedCourse;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getAllOrganizers = async () => {
    try {
        const foundedOrganizers = await prisma.organizers.findMany({});

        return foundedOrganizers;
    } catch (error) {
        throw error;
    }
};

const getOrganizerById = async (organizer_id) => {
    try {
        const foundedOrganizer = await prisma.organizers.findUnique({
            where: {
                id: organizer_id
            }
        });

        return foundedOrganizer;
    } catch (error) {
        throw error;
    }
};

const getOrganizerByName = async (name) => {
    try {
        const foundedOrganizer = await prisma.organizers.findUnique({
            where: {
                name: name
            }
        });

        return foundedOrganizer;
    } catch (error) {
        throw error;
    }
};

const updateOrganizerById = async (organizer_id, name) => {
    try {
        const updatedOrganizer = await prisma.organizers.update({
            where: {
                id: organizer_id
            },
            data: {
                name: name
            }
        });

        return updatedOrganizer;
    } catch (error) {
        throw error;
    }
};

const deleteOrganizerById = async (organizer_id) => {
    try {
        const deletedOrganizer = await prisma.organizers.update({
            where: {
                id: organizer_id
            },
            data: {
                is_deleted: true
            }
        });

        return deletedOrganizer;
    } catch (error) {
        throw error;
    }
};

const undeleteOrganizerById = async (organizer_id) => {
    try {
        const undeletedOrganizer = await prisma.organizers.update({
            where: {
                id: organizer_id
            },
            data: {
                is_deleted: false
            }
        });

        return undeletedOrganizer;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createOrganizer,
    uploadImage,
    getAllOrganizers,
    getOrganizerById,
    getOrganizerByName,
    updateOrganizerById,
    deleteOrganizerById,
    undeleteOrganizerById
};
