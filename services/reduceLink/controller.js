const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const HttpError = require('../../utils/httpError');
const Errors = require('../../const/errors');

const redirectReducedLink = async (req, res, next) => {
    const linkId = req.params.link_id;

    try {
        // Await the result of getOriginalLink
        const originalUrl = await getOriginalLink(linkId);

        // Handle case where originalUrl is null
        if (!originalUrl) {
            const error = new HttpError(Errors.Link_Not_Found); // Custom error for not found
            return next(error);
        }

        res.redirect(originalUrl);
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getOriginalLink = async (linkId) => {
    try {
        console.log(linkId);

        const foundedUrl = await prisma.reduced_links.findFirst({
            where: {
                link_id: linkId
            }
        });

        // Check if foundedUrl is null
        if (!foundedUrl) {
            console.log('null');
            return null; // Return null if no record is found
        }

        console.log(foundedUrl);

        const originalUrl = foundedUrl.url;

        return originalUrl;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    redirectReducedLink
};
