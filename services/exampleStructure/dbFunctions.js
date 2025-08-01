const { PrismaClient } = require('@prisma/client');
const environment = require('../../configs/environments');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');

// Write a contact
const addVideo = async (input) => {
    try {
        const result = await prisma.gallery.create({
            data: {
                ...input
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
};

// Get all contents
const getAllVideos = async () => {
    try {
        const result = await prisma.gallery.findMany({});
        return result;
    } catch (error) {
        throw error;
    }
};

const getVideoById = async (input) => {
    try {
        const result = await prisma.gallery.findFirst({
            where: {
                id: id
            }
        });

        return foundedRole;
    } catch (error) {
        throw error;
    }
};

const updateVideoById = async (input) => {
    try {
        const result = await prisma.gallery.update({
            where: {
                id: id
            },
            data: {
                name: name
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const deleteVideoById = async (input) => {
    try {
        const result = await prisma.gallery.update({
            where: {
                id: id
            },
            data: {
                is_deleted: true
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const undeleteVideoById = async (input) => {
    try {
        const result = await prisma.gallery.update({
            where: {
                id: id
            },
            data: {
                is_deleted: false
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};
module.exports = {
    addVideo,
    getAllVideos,
    getVideoById,
    updateVideoById,
    deleteVideoById,
    undeleteVideoById
};
