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

const getProfileByUserId = async (userId) => {
    try {
        const result = await prisma.profiles.findFirst({
            where: {
                user_id: userId
            },
            include: {
                profile_degrees: true,
                profile_skills: true,
                profile_social_networks: true
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
};

const getProfileByProfileId = async (profile_id) => {
    try {
        const foundedProfile = await prisma.profiles.findFirst({
            where: {
                id: profile_id
            },
            include: {
                profile_degrees: true,
                profile_social_networks: true,
                profile_skills: {
                    include: {
                        skill: true
                    }
                }
            }
        });

        if (!foundedProfile) {
            throw new Error('Profile not found');
        }

        const user_info = await prisma.user_info.findFirst({
            where: {
                user_id: foundedProfile.user_id
            }
        });

        const enhancedDegrees = await Promise.all(
            foundedProfile.profile_degrees.map(async (degree) => {
                let fieldName = null;
                let levelName = null;

                if (degree.field !== null) {
                    const schoolField = await prisma.study_fields_school.findUnique({
                        where: { id: degree.field }
                    });
                    if (schoolField) {
                        fieldName = schoolField.name;
                    } else {
                        const universityField = await prisma.study_fields_university.findUnique({
                            where: { id: degree.field }
                        });
                        if (universityField) {
                            fieldName = universityField.name;
                        }
                    }
                }

                if (degree.level !== null) {
                    const schoolLevel = await prisma.school_levels.findUnique({
                        where: { id: degree.level }
                    });
                    if (schoolLevel) {
                        levelName = schoolLevel.name;
                    } else {
                        const universityLevel = await prisma.university_levels.findUnique({
                            where: { id: degree.level }
                        });
                        if (universityLevel) {
                            levelName = universityLevel.name;
                        }
                    }
                }

                return {
                    ...degree,
                    field: {
                        id: degree.field,
                        name: fieldName
                    },
                    level: {
                        id: degree.level,
                        name: levelName
                    }
                };
            })
        );

        foundedProfile['image'] = user_info.image;
        foundedProfile['name'] = user_info.name;
        foundedProfile['family'] = user_info.family;

        foundedProfile.profile_degrees = enhancedDegrees;

        foundedProfile.profile_skills = foundedProfile.profile_skills.map((ps) => ({
            id: ps.skill_id,
            name: ps.skill.name
        }));

        return foundedProfile;
    } catch (error) {
        console.error(error);
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

const updateProfileImage = async (user_id, image) => {
    try {
        const result = await prisma.user_info.update({
            where: {
                user_id: user_id
            },
            data: {
                image: image
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
};

const updateAboutMe = async (user_id, about) => {
    try {
        await prisma.profiles.update({
            where: {
                user_id: user_id
            },
            data: {
                about: about
            }
        });

        const result = await prisma.user_info.update({
            where: {
                user_id: user_id
            },
            data: {
                about_me: about
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
};

const updateTitle = async (user_id, title) => {
    try {
        const result = await prisma.profiles.update({
            where: {
                user_id: user_id
            },
            data: {
                title: title
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

const deleteAllProfileSocialNetworks = async (profileId) => {
    try {
        await prisma.profile_social_networks.deleteMany({
            where: {
                profile_id: profileId
            }
        });

        return true;
    } catch (error) {
        console.error('Error deleting profile social networks:', error);
        throw error;
    }
};

module.exports = {
    createProfile,
    addSkill,
    addSocialNetwork,
    getProfileByUserId,
    getProfileByProfileId,
    getSkillById,
    getAllAssignedSkills,
    updateProfileImage,
    updateAboutMe,
    setProfileStatusPending,
    updateTitle,
    deleteAssignedSkill,
    deleteAllProfileSocialNetworks
};
