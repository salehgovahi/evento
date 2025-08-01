const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Write a contact
const createProfile = async (userId) => {
    try {
        const result = await prisma.profile.create({
            data: {
                user_id: userId
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
};

const addSkill = async (profile_id, skill_id) => {
    try {
        const result = await prisma.profile_skills.create({
            data: {
                profile_id: profile_id,
                skill_id: skill_id
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
};

// Get all pending profile publishes
const getPendingProfilesToPublish = async () => {
    try {
        const result = await prisma.profiles.findMany({
            where:{
                status: "pending"
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

const getProfileById = async (profile_id) => {
    try {
        const result = await prisma.profiles.findFirst({
            where: {
                id: profile_id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const getAssignedSkill = async (profile_id, skill_id) => {
    try {
        const result = await prisma.profile_skills.findFirst({
            where: {
                profile_id: profile_id,
                skill_id: skill_id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const getSkillById = async (skill_id) => {
    try {
        const result = await prisma.defined_skills.findFirst({
            where: {
                id: skill_id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};


const requestPublishProfile = async (profile_id) => {
    try {
        const result = await prisma.profiles.update({
            where: {
                id: profile_id
            },
            data: {
                status: "pending"
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const requestPrivateProfile = async (profile_id) => {
    try {
        const result = await prisma.profiles.update({
            where: {
                id: profile_id
            },
            data: {
                status: "private"
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const modifyProfileStatus = async (profile_id, status) => {
    try {
        const result = await prisma.profiles.update({
            where: {
                id: profile_id
            },
            data: {
                status: status
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const deleteAssignedSkill = async (profile_id, skill_id) => {
    try {
        const result = await prisma.profile_skills.delete({
            where: {
                id: id
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
    createProfile,
    addSkill,
    getPendingProfilesToPublish,
    getProfileByUserId,
    getProfileById,
    getSkillById,
    getAssignedSkill,
    requestPublishProfile,
    requestPrivateProfile,
    modifyProfileStatus,
    deleteAssignedSkill,
    undeleteVideoById
};
