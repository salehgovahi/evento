const { PrismaClient } = require('@prisma/client');
const environment = require('../../configs/environments');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');

const writeContact = async (category, title, email, name, context) => {
    try {
        const createdContact = await prisma.contact_us.create({
            data: {
                category: category,
                title: title,
                email: email,
                name: name,
                context: context
            }
        });
        return createdContact;
    } catch (error) {
        throw error;
    }
};

const getAllContact = async (page, limit) => {
    try {
        const skip = (page - 1) * limit;

        let allContact = await prisma.contact_us.findMany({
            skip: skip,
            take: limit
        });

        const totalContact = await prisma.contact_us.count({});

        const totalPages = Math.ceil(totalContact / limit);

        return {
            total: totalContact,
            totalPages,
            currentPage: page,
            data: allContact
        };
    } catch (error) {
        throw error;
    }
};

const getContactById = async (contact_id) => {
    try {
        const foundedContact = await prisma.contact_us.findFirst({
            where: {
                id: contact_id
            }
        })

        return foundedContact
    } catch (error) {
        throw error;
    }
};

const answerContactById = async(contact_id, answer, answered_at, user_id) => {
    try {
        const answeredContact = await prisma.contact_us.update({
            where: {
                id: contact_id
            },
            data: {
                answer: answer,
                answered_at: answered_at,
                answered_by: user_id
            }
        })

        return answeredContact
    } catch (error) {
        throw error;
    }
};

module.exports = {
    writeContact,
    getAllContact,
    getContactById,
    answerContactById
};
