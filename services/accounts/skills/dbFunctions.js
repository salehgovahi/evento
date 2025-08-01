const { PrismaClient } = require('@prisma/client');
const environment = require('../../../configs/environments');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');

// Add an skill
const addSkill = async (name) => {
    try {
        const result = await prisma.defined_skills.create({
            data: {
                name: name
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
};

const getSkillByName = async (name) => {
    try {
        const result = await prisma.defined_skills.findUnique({
            where: {
                name: name
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const getSkillById = async (id) => {
    try {
        const result = await prisma.defined_skills.findUnique({
            where: {
                id: id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const getAllSkills = async () => {
    try {
        const result = await prisma.defined_skills.findMany({});

        return result;
    } catch (error) {
        throw error;
    }
};

const updateSkillById = async (skill_id, name) => {
    try {
        const result = await prisma.defined_skills.update({
            where: {
                id: skill_id
            },
            data: {
                name: name
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const deleteSkillById = async (skill_id) => {
    try {
        const result = await prisma.defined_skills.delete({
            where: {
                id: skill_id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addSkill,
    getAllSkills,
    getSkillById,
    getSkillByName,
    updateSkillById,
    deleteSkillById,
};
