const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProfile = async (profile_id) => {
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

module.exports = {
    getProfile
};
