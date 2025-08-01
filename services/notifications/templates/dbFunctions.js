const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add a template
const addTemplate = async (code, title, body, user_id) => {
    try {
        const result = await prisma.notification_templates.create({
            data: {
                code: code,
                title: title,
                body: body,
                updated_by: user_id
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
};

// Get all templates
const getAllTemplates = async () => {
    try {
        const result = await prisma.notification_templates.findMany({});
        return result;
    } catch (error) {
        throw error;
    }
};

// Get template by id
const getTemplateById = async (template_id) => {
    try {
        const result = await prisma.notification_templates.findFirst({
            where: {
                id: template_id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

// Get template by code
const getTemplateByCode = async (code) => {
    try {
        const result = await prisma.notification_templates.findFirst({
            where: {
                code: code
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

// Update template by id
const updateTemplateById = async (template_id, updateData) => {
    try {
        const result = await prisma.notification_templates.update({
            where: {
                id: template_id
            },
            data: {
                ...updateData
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

// Delete template by id
const deleteTemplateById = async (template_id) => {
    try {
        const result = await prisma.notification_templates.delete({
            where: {
                id: template_id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

// Undelete template by id
const undeleteTemplateById = async (template_id) => {
    try {
        const result = await prisma.notification_templates.update({
            where: {
                id: template_id
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
module.exports = {
    addTemplate,
    getAllTemplates,
    getTemplateById,
    getTemplateByCode,
    updateTemplateById,
    deleteTemplateById,
    undeleteTemplateById
};
