const shortId = require('shortid');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateReducedLink = async (url) => {
    try {
        const id = shortId.generate();

        await prisma.reduced_links.create({
            data: {
                link_id: id,
                url: url
            }
        });

        const reducedLink = `https://evento.ir/${id}`;

        return reducedLink;
    } catch (error) {
        throw error;
    }
};

module.exports = { generateReducedLink };
