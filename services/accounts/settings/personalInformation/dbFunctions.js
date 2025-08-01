const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getInformation = async (user_id) => {
    try {
        let userInformation = await prisma.user_info.findFirst({
            where: {
                user_id: user_id
            }
        });

        
        return userInformation;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getProvinces = async () => {
    try {
        let provinces = await prisma.provinces.findMany({
            select: {
                id: true,
                province_name: true
            }
        });

        return provinces;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getUniversityLevel = async () => {
    try {
        let levels = await prisma.university_levels.findMany({
            select: {
                id: true,
                name: true
            }
        });

        return levels;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getSchoolLevels = async () => {
    try {
        let levels = await prisma.school_levels.findMany({
            select: {
                id: true,
                name: true
            }
        });

        return levels;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getSchoolStudyFields = async () => {
    try {
        let fields = await prisma.study_fields_school.findMany({
            select: {
                id: true,
                name: true
            }
        });

        return fields;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getUniversityStudyFields = async () => {
    try {
        let fields = await prisma.study_fields_university.findMany({
            select: {
                id: true,
                name: true
            }
        });

        return fields;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getMilitaryStatus = async () => {
    try {
        let status = await prisma.military_status.findMany({
            select: {
                id: true,
                name: true
            }
        });

        return status;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getFamiliarityWays = async () => {
    try {
        let familiarityWays = await prisma.familiarity_ways.findMany({
            select: {
                id: true,
                name: true
            }
        });

        return familiarityWays;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getCitiesOfAProvince = async (province_id) => {
    try {
        let cities = await prisma.cities.findMany({
            where: {
                province_id: province_id
            },
            select: {
                id: true,
                city_name: true
            }
        });

        return cities;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const uploadImage = async (userId, imagePath) => {
    try {
        let updatedUser = await prisma.user_info.update({
            where: {
                user_id: userId
            },
            data: {
                image: imagePath
            }
        });

        return updatedUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const deleteImage = async (userId) => {
    try {
        let updatedUser = await prisma.user_info.update({
            where: {
                user_id: userId
            },
            data: {
                image: null
            }
        });

        return updatedUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const uploadCV = async (userId, cvPath) => {
    try {
        let updatedUser = await prisma.user_info.update({
            where: {
                user_id: userId
            },
            data: {
                cv: cvPath
            }
        });

        return updatedUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const uploadMotivationLetter = async (userId, filePath) => {
    try {
        let updatedUser = await prisma.user_info.update({
            where: {
                user_id: userId
            },
            data: {
                motivation_letter: filePath
            }
        });

        return updatedUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const updateInformation = async (user_id, profile) => {
    try {
        let updatedUser = await prisma.user_info.update({
            where: {
                user_id: user_id
            },
            data: profile
        });

        return updatedUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = {
    getInformation,
    getProvinces,
    getCitiesOfAProvince,
    getUniversityLevel,
    getSchoolLevels,
    getSchoolStudyFields,
    getUniversityStudyFields,
    getMilitaryStatus,
    getFamiliarityWays,
    uploadImage,
    uploadCV,
    uploadMotivationLetter,
    updateInformation,
    deleteImage
};
