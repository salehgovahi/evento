const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Write a contact
const createProfile = async (userId) => {
    try {
        const result = await prisma.profiles.create({
            data: {
                user_id: userId
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
};

const addDegree = async (addDegreeData) => {
    try {
        const result = await prisma.profile_degrees.create({
            data: {
                ...addDegreeData
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

// Get all degrees
const getAllDegrees = async (profile_id) => {
    try {
        const result = await prisma.profile_degrees.findMany({
            where:{
                profile_id: profile_id
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
};

const getProfileByUserId = async (user_id) => {
    try {
        const result = await prisma.profiles.findFirst({
            where: {
                user_id: user_id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const getDegreeById = async (degree_id) => {
    try {
        const result = await prisma.profile_degrees.findFirst({
            where: {
                id: degree_id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};


const updateDegreeById = async (degree_id,input) => {
    try {
        const result = await prisma.profile_degrees.update({
            where: {
                id: degree_id
            },
            data: {
                ...input
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const deleteDegreeById = async (id) => {
    try {
        const result = await prisma.profile_degrees.delete({
            where: {
                id: id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const undeleteDegreeById = async (input) => {
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

const setProfileStatusPending = async (profileId) => {
    try {
        await prisma.profiles.update({
            where: {
                id: profileId
            },
            data:{
                status: "pending"
            }
        })
    } catch (error) {
        throw error;
    }
}
module.exports = {
    createProfile,
    addDegree,
    getAllDegrees,
    getProfileByUserId,
    getDegreeById,
    updateDegreeById,
    deleteDegreeById,
    undeleteDegreeById,
    setProfileStatusPending
};
