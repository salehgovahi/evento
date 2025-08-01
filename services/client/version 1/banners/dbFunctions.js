const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all undeleted advertisement banners
const getAllBanners = async () => {
    try {
        const allBanners = await prisma.advertisement_banners.findMany({
            where: {
                is_deleted: false
            }
        });

        return allBanners;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    getAllBanners
};
