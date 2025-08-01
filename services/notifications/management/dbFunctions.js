const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

const getAllTemplates = async () => {
    try {
        const result = await prisma.notification_templates.findMany({});
        return result;
    } catch (error) {
        throw error;
    }
};

const getAllInAppNotifications = async (user_id, roleIds, filter = 'all') => {
    try {
        const readFilter =
            filter === 'read'
                ? { read_at: null }
                : filter === 'unread'
                  ? { NOT: { read_at: null } }
                  : {};

        const personalNotifications = await prisma.notification_recipients
            .findMany({
                where: {
                    user_id,
                    ...readFilter,
                    channel_statuses: {
                        some: { channel: 'IN_APP' }
                    }
                },
                include: {
                    notification: {
                        include: { template: true }
                    }
                }
            })
            .then((notifs) =>
                notifs.map((notif) => ({
                    notification_id: notif.notification_id,
                    recipient_id: notif.id,
                    user_id: notif.user_id,
                    read_at: notif.read_at,
                    title: parseTemplate(
                        notif.notification?.template.title,
                        notif.notification?.meta
                    ),
                    body: parseTemplate(
                        notif.notification?.template.body,
                        notif.notification?.meta
                    ),
                    type: 'PERSONAL',
                    status: notif.notification?.status,
                    meta: notif.notification?.meta,
                    created_at: notif.notification?.created_at
                }))
            );

        const audienceNotifications = await prisma.notification_audiences
            .findMany({
                where: {
                    role_id: { in: roleIds },
                    ...readFilter
                },
                include: {
                    notification: {
                        include: { template: true }
                    }
                }
            })
            .then((notifs) =>
                notifs.map((notif) => ({
                    notification_id: notif.notification_id,
                    recipient_id: notif.id,
                    role_id: notif.role_id,
                    read_at: notif.read_at,
                    title: notif.notification?.template.title,
                    body: parseTemplate(
                        notif.notification?.template.body,
                        notif.notification?.meta
                    ),
                    type: 'AUDIENCE',
                    status: notif.notification?.status,
                    meta: notif.notification?.meta,
                    created_at: notif.notification?.created_at
                }))
            );

        return [...personalNotifications, ...audienceNotifications];
    } catch (error) {
        throw error;
    }
};

const markNotificationAsRead = async ({ notification_id, user_id, roleIds }) => {
    try {
        // 1️⃣ Try PERSONAL first
        const recipient = await prisma.notification_recipients.findFirst({
            where: {
                notification_id,
                user_id
            },
            select: { id: true } // only select id for performance
        });

        if (recipient) {
            const updated = await prisma.notification_recipients.updateMany({
                where: {
                    notification_id,
                    user_id,
                    read_at: null // ✅ only unread
                },
                data: {
                    read_at: new Date()
                }
            });

            return { success: true, updatedCount: updated.count, type: 'PERSONAL' };
        }

        // 2️⃣ Try AUDIENCE
        const audience = await prisma.notification_audiences.findFirst({
            where: {
                notification_id,
                role_id: { in: roleIds }
            },
            select: { id: true }
        });

        if (audience) {
            const updated = await prisma.notification_audiences.updateMany({
                where: {
                    notification_id,
                    role_id: { in: roleIds },
                    read_at: null // ✅ only unread
                },
                data: {
                    read_at: new Date()
                }
            });

            return { success: true, updatedCount: updated.count, type: 'AUDIENCE' };
        }

        // 3️⃣ Not found
        throw new Error('Notification not found for user or roles');
    } catch (error) {
        throw error;
    }
};

const getNotificationById = async (notification_id) => {
    try {
        const result = await prisma.notifications.findFirst({
            where: {
                id: notification_id
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

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

const parseTemplate = (template, meta) => {
    return template.replace(/{(\w+)}/g, (match, p1) => {
        return meta[p1] !== undefined ? meta[p1] : '';
    });
};

module.exports = {
    addTemplate,
    getAllInAppNotifications,
    getAllTemplates,
    getNotificationById,
    markNotificationAsRead,
    getTemplateByCode,
    updateTemplateById,
    deleteTemplateById,
    undeleteTemplateById
};
