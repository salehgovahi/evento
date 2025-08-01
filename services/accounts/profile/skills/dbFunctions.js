const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

const getAllAssignedSkills = async (profile_id) => {
    try {
        const result = await prisma.profile_skills.findMany({
            where: {
                profile_id: profile_id
            },
            include: {
                skill: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return result.map((skill) => ({
            id: skill.id,
            profile_id: skill.profile_id,
            skill_id: skill.skill_id,
            skill_name: skill.skill?.name
        }));
    } catch (error) {
        throw error;
    }
};

const getAllDefinedSkills = async (skill_name = '') => {
    try {
        const result = await prisma.defined_skills.findMany({
            where: {
                name: {
                    contains: skill_name,
                    mode: 'insensitive'
                }
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

const updateDegreeById = async (degree_id, input) => {
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

const deleteAssignedSkill = async (profile_id, skill_id) => {
    try {
        const existingSkill = await prisma.profile_skills.findUnique({
            where: {
                skill_id_profile_id: {
                    skill_id: skill_id,
                    profile_id: profile_id
                }
            }
        });

        if (!existingSkill) {
            return;
        }

        const result = await prisma.profile_skills.delete({
            where: {
                skill_id_profile_id: {
                    skill_id: skill_id,
                    profile_id: profile_id
                }
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

module.exports = {
    createProfile,
    addSkill,
    getAllAssignedSkills,
    getAllDefinedSkills,
    getProfileByUserId,
    getSkillById,
    getAssignedSkill,
    updateDegreeById,
    deleteAssignedSkill,
    undeleteVideoById,
    setProfileStatusPending
};
