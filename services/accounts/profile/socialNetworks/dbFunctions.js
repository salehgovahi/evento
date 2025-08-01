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

const addSocialNetwork = async (profile_id, name, link) => {
    try {
        const result = await prisma.profile_social_networks.create({
            data: {
                profile_id: profile_id,
                name: name,
                link: link
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
};

// Get all degrees
const getAddedSocialNetworks = async (profile_id) => {
    try {
        const result = await prisma.profile_social_networks.findMany({
            where: {
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

const getAddedSocialNetwork = async (profile_id, name) => {
    try {
        const result = await prisma.profile_social_networks.findFirst({
            where: {
                name: name,
                profile_id: profile_id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const updateSocialNetwork = async (id, name, link) => {
    try {
        const result = await prisma.profile_social_networks.update({
            where: {
                id: id
            },
            data: {
                name: name,
                link: link
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

const setProfileStatusPending = async (profileId) => {
    try {
        await prisma.profiles.update({
            where: {
                id: profileId
            },
            data: {
                status: 'pending'
            }
        });
    } catch (error) {
        throw error;
    }
};

const getSocialNetworkByIdAndProfileId = async (social_network_id, profile_id) => {
    try {
        const result = await prisma.profile_social_networks.findUnique({
            where: {
                id: social_network_id,
                profile_id: profile_id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const deleteSocialNetwork = async (social_network_id) => {
    try {
        const result = await prisma.profile_social_networks.delete({
            where: { id: social_network_id }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createProfile,
    addSocialNetwork,
    getAddedSocialNetworks,
    getProfileByUserId,
    getAddedSocialNetwork,
    getAssignedSkill,
    updateSocialNetwork,
    deleteAssignedSkill,
    undeleteVideoById,
    setProfileStatusPending,
    getSocialNetworkByIdAndProfileId,
    deleteSocialNetwork
};
