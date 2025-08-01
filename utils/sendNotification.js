const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const producerRabbitmq = require('../utils/producerRabbitmq');
const environments = require('../configs/environments');

/**
 * Send a notification (AUDIENCE or PERSONAL).
 *
 * @param {Object} params
 * @param {string} [params.title] - Notification title
 * @param {string} [params.body] - Notification body
 * @param {string} params.type - "AUDIENCE" or "PERSONAL"
 * @param {string} [params.templateCode] - Template code
 * @param {Object} [params.meta] - Optional JSON meta
 * @param {string} [params.audienceRoleId] - Required for AUDIENCE
 * @param {string} [params.recipientUserId] - Required for PERSONAL
 * @returns {Promise<{ notification: Object, recipient?: Object, audience?: Object }>}
 */
async function sendNotification({
    title = null,
    body = null,
    type,
    templateCode = null,
    meta = null,
    audienceRoleId = null,
    recipientUserId = null
}) {
    if (type === 'AUDIENCE' && !audienceRoleId) {
        throw new Error('AUDIENCE notification requires audienceRoleId.');
    }
    if (type === 'PERSONAL' && !recipientUserId) {
        throw new Error('PERSONAL notification requires recipientUserId.');
    }

    return prisma.$transaction(async (tx) => {
        let templateId = null;
        let resolvedTitle = title;
        let resolvedBody = body;
        let template = null;

        if (templateCode) {
            template = await tx.notification_templates.findUnique({
                where: { code: templateCode }
            });
            if (!template) {
                throw new Error(`Template with code "${templateCode}" not found.`);
            }
            templateId = template.id;
            resolvedTitle = template.title;
            resolvedBody = template.body;
        }

        let notification = await tx.notifications.create({
            data: {
                type,
                template_id: templateId,
                meta
            }
        });

        notification["body"] = parseTemplate(resolvedBody, meta);        

        let audience = null;
        let recipient = null;

        if (type === 'AUDIENCE') {
            audience = await tx.notification_audiences.create({
                data: {
                    notification_id: notification.id,
                    role_id: audienceRoleId
                }
            });
        }

        if (type === 'PERSONAL') {
            recipient = await tx.notification_recipients.create({
                data: {
                    notification_id: notification.id,
                    user_id: recipientUserId
                }
            });
        }

        return { notification, audience, recipient };
    });
}

/**
 * Add a delivery channel status.
 *
 * @param {Object} params
 * @param {string} [params.recipientId] - Required for PERSONAL
 * @param {string} [params.audienceId] - Required for AUDIENCE
 * @param {string} params.channel - EMAIL | SMS | PUSH | IN_APP
 * @param {string} params.status - PENDING | SENT | DELIVERED | FAILED
 * @param {string} [params.errorMessage] - Optional
 */
async function addChannelStatus({
    notification = null,
    recipientId = null,
    audienceId = null,
    channel,
    status,
    errorMessage = null,
    receiver = null
}) {
    let notificationChannelStatus = await prisma.notification_channel_status.create({
        data: {
            recipient_id: recipientId,
            channel,
            status,
            sent_at: status === 'SENT' ? new Date() : undefined
        }
    });

    let sendNotificationRequest = {
        notification_channel_status_id: notificationChannelStatus.id,
        receiver: receiver,
        title: notification.title,
        body: notification.body,
        channel: channel,
        retry_times: notificationChannelStatus.retry_times
    }    
    
    if (channel === 'EMAIL') { 
        await producerRabbitmq.sendNotificationToQueue(
            environments.SEND_EMAIL_QUEUE_NAME,
            sendNotificationRequest
        );
    }
    if (channel === 'SMS') {
        await producerRabbitmq.sendNotificationToQueue(
            environments.SEND_SMS_QUEUE_NAME,
            sendNotificationRequest
        );
    }

    return notificationChannelStatus;
}

/**
 * Mark a PERSONAL recipient notification as read.
 *
 * @param {string} recipientId
 */
async function markRecipientRead(recipientId) {
    return prisma.notification_recipients.update({
        where: { id: recipientId },
        data: { read_at: new Date() }
    });
}

/**
 * Mark an AUDIENCE notification as read for everyone.
 *
 * @param {string} notificationId
 */
async function markAudienceNotificationRead(notificationId) {
    return prisma.notifications.update({
        where: { id: notificationId },
        data: { read_at: new Date() }
    });
}

/**
 * Upsert a notification template.
 *
 * @param {Object} params
 * @param {string} params.code - Template code
 * @param {string} params.title - Template title
 * @param {string} params.body - Template body
 * @param {string} params.updatedBy - Updater user UUID
 */
async function upsertTemplate({ code, title, body, updatedBy }) {
    return prisma.notification_templates.upsert({
        where: { code },
        update: {
            title,
            body,
            updated_by: updatedBy
        },
        create: {
            code,
            title,
            body,
            updated_by: updatedBy
        }
    });
}

module.exports = {
    sendNotification,
    addChannelStatus,
    markRecipientRead,
    markAudienceNotificationRead,
    upsertTemplate
};


const parseTemplate = (template, meta) => {
    return template.replace(/{(\w+)}/g, (match, p1) => {
        return meta[p1] !== undefined ? meta[p1] : '';
    });
};
