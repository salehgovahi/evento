const amqp = require('amqplib');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const environments = require('../configs/environments');
const HttpError = require('../utils/httpError');
const Errors = require('../const/errors');
const producerRabbitmq = require('../utils/producerRabbitmq');
const decrypt = require('../utils/decryption');
const receiveVideosStatus = async (queue) => {
    let connection;

    try {
        connection = await amqp.connect(
            `amqp://${environments.RABBITMQ_USER}:${environments.RABBITMQ_PASSWORD}@${environments.RABBITMQ_SERVER_IP}:${environments.RABBITMQ_SERVER_PORT}`
        );
        const channel = await connection.createChannel();
        const queueName = queue;

        await channel.assertQueue(queueName, { durable: false });

        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());

                let { id, status, video_length } = message;

                const related_to = await getVideoRelatedTo(id);

                try {
                    if (related_to == 'course') {
                        await updateCourseVideoStatus(id, status);
                    } else if (related_to == 'unit') {
                        await updateUnitVideoStatus(id, status, video_length);
                    }
                } catch (error) {
                    console.error(`Error removing output directory: ${error.message}`);
                }

                channel.ack(msg);
            }
        });
    } catch (err) {
        console.warn(err);
    }
};

const getVideoRelatedTo = async (id) => {
    try {
        const existingCourse = await prisma.courses.findFirst({
            where: {
                id: id
            }
        });

        const existingUnit = await prisma.units.findFirst({
            where: {
                id: id
            }
        });

        if (existingCourse) {
            return 'course';
        }
        if (existingUnit) {
            return 'unit';
        }
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        throw error;
    }
};

const updateCourseVideoStatus = async (related_to_id, status) => {
    try {
        const existingCourse = await prisma.courses.findFirst({
            where: {
                id: related_to_id
            }
        });
        if (!existingCourse) {
            const error = new HttpError(Errors.Course_Undefined);
            throw error;
        }

        let content_id = await prisma.courses.findMany({
            where: {
                id: related_to_id
            },
            select: {
                content_id: true
            }
        });

        content_id = content_id[0].content_id;

        const uploadedVideo = await prisma.course_content.update({
            where: {
                id: content_id
            },
            data: {
                advertisement_video: status
            }
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        throw error;
    }
};

const updateUnitVideoStatus = async (related_to_id, status, videoLength) => {
    try {
        if (videoLength == undefined) {
            videoLength = 0;
        }

        const existingUnit = await prisma.units.findFirst({
            where: {
                id: related_to_id
            },
            include: {
                chapters: {
                    include: {
                        courses: true // Include the course information
                    }
                }
            }
        });

        if (!existingUnit) {
            const error = new HttpError(Errors.Unit_Undefined);
            throw error;
        }

        // Update the unit with the new video and video length
        let updatedUnit = await prisma.units.update({
            where: {
                id: related_to_id
            },
            data: {
                video: status,
                video_length: videoLength
            }
        });

        // Now get the course ID from the unit's chapter
        const course_id = existingUnit.chapters.courses.id; // Assuming there is a relation set up that allows access to `courses` from `chapters`

        // Increment the length_time in course_statistics
        await prisma.course_statistics.updateMany({
            where: {
                courses: {
                    some: {
                        id: course_id
                    }
                }
            },
            data: {
                length_time: {
                    increment: videoLength
                }
            }
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        throw error;
    }
};

const receiveNotificationStatus = async (queue) => {
    let connection;

    try {
        connection = await amqp.connect(
            `amqp://${environments.RABBITMQ_USER}:${environments.RABBITMQ_PASSWORD}@${environments.RABBITMQ_SERVER_IP}:${environments.RABBITMQ_SERVER_PORT}`
        );
        const channel = await connection.createChannel();
        const queueName = queue;

        await channel.assertQueue(queueName, { durable: false });

        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                let response = decrypt.decrypt(msg.content.toString());                
                response = JSON.parse(response);
                let responseData = response.data;
                delete response.data;

                try {
                    if (response.ok) {
                        let channelStatusId = response.notification_channel_id;
                        delete response.notification_channel_id;
                        delete response.ok;

                        response['status'] = 'DELIVERED';
                        const result = await updateChannelStatus(channelStatusId, response);
                    } else {
                        let channelStatusId = response.notification_channel_id;
                        delete response.notification_channel_id;
                        delete response.ok;
                        response['status'] = 'FAILED';
                        response['retry_times'] = response['retry_times'] + 1;
                        const result = await updateChannelStatus(channelStatusId, response);

                        if (response['retry_times'] < 3) {
                            let sendNotificationRequest = {
                                notification_channel_status_id: result.id,
                                receiver: responseData.receiver,
                                title: responseData.title,
                                body: responseData.body,
                                channel: response.channel,
                                retry_times: result.retry_times
                            };

                            if (response.channel === 'EMAIL') {
                                await producerRabbitmq.sendNotificationToQueue(
                                    environments.SEND_EMAIL_QUEUE_NAME,
                                    sendNotificationRequest
                                );
                            }
                            if (response.channel === 'SMS') {
                                await producerRabbitmq.sendNotificationToQueue(
                                    environments.SEND_SMS_QUEUE_NAME,
                                    sendNotificationRequest
                                );
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error removing output directory: ${error.message}`);
                }

                channel.ack(msg);
            }
        });
    } catch (err) {
        console.warn(err);
    }
};

module.exports = {
    receiveVideosStatus,
    receiveNotificationStatus
};

const updateChannelStatus = async (channelStatusId, status) => {
    try {
        const existingChannelStatus = await prisma.notification_channel_status.findFirst({
            where: {
                id: channelStatusId
            }
        });
        if (!existingChannelStatus) {
            const error = new HttpError(Errors.Channel_Status_Undefined);
            throw error;
        }

        return await prisma.notification_channel_status.update({
            where: {
                id: channelStatusId
            },
            data: {
                ...status
            }
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        throw error;
    }
};
