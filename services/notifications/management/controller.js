const HttpError = require('../../../utils/httpError');
const Errors = require('../../../const/errors');
const dbFunctions = require('./dbFunctions');
const roleDbFunctions = require('../../roles/dbFunctions');

const sendNotification = async (req, res, next) => {
    const { title, body, type, templateCode, meta, recipients, audiences } = req.body;

    try {
        if (type === 'PERSONAL' && (!recipients || recipients.length === 0)) {
            return res
                .status(400)
                .json({ error: 'Recipients are required for PERSONAL notifications' });
        }

        if (type === 'AUDIENCE' && (!audiences || audiences.length === 0)) {
            return res
                .status(400)
                .json({ error: 'Audiences are required for AUDIENCE notifications' });
        }

        if (!channels || !Array.isArray(channels) || channels.length === 0) {
            return res.status(400).json({ error: 'At least one channel is required' });
        }

        let templateId = null;
        if (templateCode) {
            const template = await prisma.notification_templates.findUnique({
                where: { code: templateCode }
            });
            if (!template) {
                return res.status(404).json({ error: 'Template not found' });
            }
            templateId = template.id;
        }

        const notification = await prisma.notifications.create({
            data: {
                title,
                body,
                type,
                template_id: templateId,
                status: 'PENDING',
                meta: meta || {}
            }
        });

        if (type === 'PERSONAL') {
            await Promise.all(
                recipients.map(async (userId) => {
                    const recipient = await prisma.notification_recipients.create({
                        data: {
                            notification_id: notification.id,
                            user_id: userId
                        }
                    });

                    await Promise.all(
                        channels.map((channel) =>
                            prisma.notification_channel_status.create({
                                data: {
                                    recipient_id: recipient.id,
                                    channel,
                                    status: 'PENDING'
                                }
                            })
                        )
                    );
                })
            );
        }

        if (type === 'AUDIENCE') {
            await Promise.all(
                audiences.map((roleId) =>
                    prisma.notification_audiences.create({
                        data: {
                            notification_id: notification.id,
                            role_id: roleId
                        }
                    })
                )
            );
        }

        res.status(201).json({
            id: notification.id,
            status: notification.status,
            createdAt: notification.created_at
        });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllNotificationsOfUser = async (req, res, next) => {
    const user_id = req.user_id;
    const filter = req.query.filter || 'all';

    try {
        const getRoleIdsOfUser = await roleDbFunctions.getRoleOfUser(user_id);

        const roleIds = getRoleIdsOfUser.map((role) => role.role_id);

        const allNotifications = await dbFunctions.getAllInAppNotifications(
            user_id,
            roleIds,
            filter
        );

        res.status(200).json({
            status: 'success',
            result: allNotifications
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const readNotificationById = async (req, res, next) => {
    const notification_id = req.params.notification_id;
    const user_id = req.user_id;

    try {
        const existingNotification = await dbFunctions.getNotificationById(notification_id);
        if (!existingNotification) {
            const error = new HttpError(Errors.Notification_Undefined);
            return next(error);
        }

        const getRoleIdsOfUser = await roleDbFunctions.getRoleOfUser(user_id);

        const roleIds = getRoleIdsOfUser.map((role) => role.role_id);

        const updatedNotification = await dbFunctions.markNotificationAsRead(
            notification_id,
            user_id,
            roleIds
        );

        res.status(200).json({
            status: 'success',
            result: updatedNotification
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const getAllVideos = async (req, res, next) => {
    try {
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const getVideoById = async (req, res, next) => {
    try {
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const updateVideoById = async (req, res, next) => {
    try {
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const deleteVideoById = async (req, res, next) => {
    try {
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const undeleteVideoById = async (req, res, next) => {
    try {
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};
module.exports = {
    getAllVideos,
    getVideoById,
    getAllNotificationsOfUser,
    readNotificationById,
    updateVideoById,
    deleteVideoById,
    undeleteVideoById
};
