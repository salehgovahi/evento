const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStatistics = async () => {
    try {
        // Temporary data. It will be replaced with real statistics
        let allStatistics = {};
        allStatistics['applicants'] = 1840;
        allStatistics['interns'] = 12;
        allStatistics['courses'] = 4;
        allStatistics['teachers'] = 22;
        allStatistics['mentors'] = 10;
        allStatistics['talents_founded'] = 32;

        return allStatistics;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    getStatistics
};
