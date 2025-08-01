const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const HttpError = require('../../utils/httpError');
const Errors = require('../../const/errors');

const addCourseFeedback = async (user_id, course_id, context, rate) => {
    try {
        const foundedFeedback = await prisma.feedbacks.findFirst({
            where: {
                user_id: user_id,
                course_id: course_id
            }
        });
        if (foundedFeedback) {
            return Errors.Feedback_Rigestered;
        }
        const addedFeedback = await prisma.feedbacks.create({
            data: {
                user_id: user_id,
                context: context,
                rate: rate,
                course_id: course_id
            }
        });
        const createdFeedback = await prisma.feedbacks.findFirst({
            where: {
                user_id: user_id,
                course_id: course_id
            },
            include: {
                user: {
                    include: {
                        user_info: true // Include user_info to get the reviewer's details
                    }
                }
            }
        });
        const data = {
            id: createdFeedback.id,
            course_id: createdFeedback.course_id,
            user_id: createdFeedback.user_id,
            context: createdFeedback.context,
            rate: createdFeedback.rate,
            is_confirmed: createdFeedback.is_confirmed,
            is_deleted: createdFeedback.is_deleted,
            reviewer: {
                name: createdFeedback.user.user_info?.name || '', // Use empty string if name is not available
                family: createdFeedback.user.user_info?.family || '', // Use empty string if family is not available
                image: createdFeedback.user.user_info?.image || '' // Use empty string if image is not available
            }
        };
        return data;
    } catch (error) {
        throw error;
    }
};

const getCourseFeedback = async (course_id, page, limit) => {
    try {
        const skip = (page - 1) * limit;

        const allFeedback = await prisma.feedbacks.findMany({
            where: {
                course_id: course_id
            },
            include: {
                user: {
                    include: {
                        user_info: true // Include user_info to get the reviewer's details
                    }
                }
            },
            skip: skip,
            take: limit
        });
        const total = await prisma.feedbacks.count({
            where: {
                course_id: course_id
            }
        });
        const totalPages = Math.ceil(total / limit);
        return {
            total,
            totalPages,
            currentPage: page,
            data: allFeedback.map((feedback) => ({
                id: feedback.id,
                course_id: feedback.course_id,
                user_id: feedback.user_id,
                context: feedback.context,
                created_at: feedback.created_at,
                updated_at: feedback.updated_at,
                rate: feedback.rate,
                is_confirmed: feedback.is_confirmed,
                is_deleted: feedback.is_deleted,
                reviewer: {
                    name: feedback.user.user_info?.name || '', // Use a default value if name is not available
                    family: feedback.user.user_info?.family || '', // Use a default value if family is not available
                    image: feedback.user.user_info?.image || '' // Use a default value if image is not available
                }
            }))
        };
    } catch (error) {
        throw error;
    }
};

const notConfirmedCourseFeedback = async (course_id) => {
    try {
        const allFeedback = await prisma.feedbacks.findMany({
            where: {
                course_id: course_id,
                is_confirmed: false
            },
            include: {
                user: {
                    include: {
                        user_info: true // Include user_info to get the reviewer's details
                    }
                }
            }
        });

        const data = allFeedback.map((feedback) => ({
            id: feedback.id,
            course_id: feedback.course_id,
            user_id: feedback.user_id,
            context: feedback.context,
            created_at: feedback.created_at,
            updated_at: feedback.updated_at,
            rate: feedback.rate,
            is_confirmed: feedback.is_confirmed,
            is_deleted: feedback.is_deleted,
            reviewer: {
                name: feedback.user.user_info?.name || '', // Use a default value if name is not available
                family: feedback.user.user_info?.family || '', // Use a default value if family is not available
                image: feedback.user.user_info?.image || '' // Use a default value if image is not available
            }
        }));
        return data;
    } catch (error) {
        throw error;
    }
};

const getFeedbackById = async (feedback_id) => {
    try {
        const foundedFeedback = await prisma.feedbacks.findFirst({
            where: {
                id: feedback_id
            },
            include: {
                user: {
                    include: {
                        user_info: true // Include user_info to get the reviewer's details
                    }
                }
            }
        });

        const data = {
            id: foundedFeedback.id,
            course_id: foundedFeedback.course_id,
            user_id: foundedFeedback.user_id,
            context: foundedFeedback.context,
            created_at: foundedFeedback.created_at,
            updated_at: foundedFeedback.updated_at,
            rate: foundedFeedback.rate,
            is_confirmed: foundedFeedback.is_confirmed,
            is_deleted: foundedFeedback.is_deleted,
            reviewer: {
                name: foundedFeedback.user.user_info?.name || '', // Use empty string if name is not available
                family: foundedFeedback.user.user_info?.family || '', // Use empty string if family is not available
                image: foundedFeedback.user.user_info?.image || '' // Use empty string if image is not available
            }
        };
        return data;
    } catch (error) {
        throw error;
    }
};

const deleteFeedbackById = async (feedback_id) => {
    try {
        const deletedFeedback = await prisma.feedbacks.update({
            where: {
                id: feedback_id
            },
            data: {
                is_deleted: true
            },
            include: {
                user: {
                    include: {
                        user_info: true // Include user_info to get the reviewer's details
                    }
                }
            }
        });
        const data = {
            id: deletedFeedback.id,
            course_id: deletedFeedback.course_id,
            user_id: deletedFeedback.user_id,
            context: deletedFeedback.context,
            created_at: deletedFeedback.created_at,
            updated_at: deletedFeedback.updated_at,
            rate: deletedFeedback.rate,
            is_confirmed: deletedFeedback.is_confirmed,
            is_deleted: deletedFeedback.is_deleted,
            reviewer: {
                name: deletedFeedback.user.user_info?.name || '', // Use empty string if name is not available
                family: deletedFeedback.user.user_info?.family || '', // Use empty string if family is not available
                image: deletedFeedback.user.user_info?.image || '' // Use empty string if image is not available
            }
        };
        return data;
    } catch (error) {
        throw error;
    }
};
const undeleteFeedbackById = async (feedback_id) => {
    try {
        const deletedFeedback = await prisma.feedbacks.update({
            where: {
                id: feedback_id
            },
            data: {
                is_deleted: false
            },
            include: {
                user: {
                    include: {
                        user_info: true // Include user_info to get the reviewer's details
                    }
                }
            }
        });
        const data = {
            id: deletedFeedback.id,
            course_id: deletedFeedback.course_id,
            user_id: deletedFeedback.user_id,
            context: deletedFeedback.context,
            created_at: deletedFeedback.created_at,
            updated_at: deletedFeedback.updated_at,
            rate: deletedFeedback.rate,
            is_confirmed: deletedFeedback.is_confirmed,
            is_deleted: deletedFeedback.is_deleted,
            reviewer: {
                name: deletedFeedback.user.user_info?.name || '', // Use empty string if name is not available
                family: deletedFeedback.user.user_info?.family || '', // Use empty string if family is not available
                image: deletedFeedback.user.user_info?.image || '' // Use empty string if image is not available
            }
        };
        return data;
    } catch (error) {
        throw error;
    }
};

const updateFeedbackById = async (feedback_id, context, rate) => {
    try {
        const updatedFeedback = await prisma.feedbacks.update({
            where: {
                id: feedback_id
            },
            data: {
                context: context,
                rate: rate,
                updated_at: new Date()
            },
            include: {
                user: {
                    include: {
                        user_info: true // Include user_info to get the reviewer's details
                    }
                }
            }
        });
        const data = {
            id: updatedFeedback.id,
            course_id: updatedFeedback.course_id,
            user_id: updatedFeedback.user_id,
            context: updatedFeedback.context,
            created_at: updatedFeedback.created_at,
            updated_at: updatedFeedback.updated_at,
            rate: updatedFeedback.rate,
            is_confirmed: updatedFeedback.is_confirmed,
            is_deleted: updatedFeedback.is_deleted,
            reviewer: {
                name: updatedFeedback.user.user_info?.name || '', // Use empty string if name is not available
                family: updatedFeedback.user.user_info?.family || '', // Use empty string if family is not available
                image: updatedFeedback.user.user_info?.image || '' // Use empty string if image is not available
            }
        };
        return data;
    } catch (error) {
        throw error;
    }
};
const confirmFeedbackById = async (feedback_id) => {
    try {
        // Update the feedback to confirm it
        const foundedFeedback = await prisma.feedbacks.update({
            where: {
                id: feedback_id
            },
            data: {
                is_confirmed: true
            },
            include: {
                user: {
                    include: {
                        user_info: true // Include user_info to get the reviewer's details
                    }
                }
            }
        });

        const data = {
            id: foundedFeedback.id,
            course_id: foundedFeedback.course_id,
            user_id: foundedFeedback.user_id,
            context: foundedFeedback.context,
            created_at: foundedFeedback.created_at,
            updated_at: foundedFeedback.updated_at,
            rate: foundedFeedback.rate,
            is_confirmed: foundedFeedback.is_confirmed,
            is_deleted: foundedFeedback.is_deleted,
            reviewer: {
                name: foundedFeedback.user.user_info?.name || '', // Use empty string if name is not available
                family: foundedFeedback.user.user_info?.family || '', // Use empty string if family is not available
                image: foundedFeedback.user.user_info?.image || '' // Use empty string if image is not available
            }
        };
        return data;
    } catch (error) {
        console.error('Error confirming feedback: ', error);
        throw error;
    }
};

const getAllFeedback = async (page, limit) => {
    try {
        const skip = (page - 1) * limit;
        const allFeedback = await prisma.feedbacks.findMany({
            include: {
                user: {
                    include: {
                        user_info: true // Include user_info to get the reviewer's details
                    }
                }
            },
            skip: skip,
            take: limit
        });

        const total = await prisma.feedbacks.count({});
        const totalPages = Math.ceil(total / limit);

        // Map the feedbacks to include reviewer info in the desired format
        const response = {
            total,
            totalPages,
            currentPage: page,
            data: allFeedback.map((feedback) => ({
                id: feedback.id,
                course_id: feedback.course_id,
                user_id: feedback.user_id,
                context: feedback.context,
                created_at: feedback.created_at,
                updated_at: feedback.updated_at,
                rate: feedback.rate,
                is_confirmed: feedback.is_confirmed,
                is_deleted: feedback.is_deleted,
                reviewer: {
                    name: feedback.user.user_info?.name || '', // Use a default value if name is not available
                    family: feedback.user.user_info?.family || '', // Use a default value if family is not available
                    image: feedback.user.user_info?.image || '' // Use a default value if image is not available
                }
            }))
        };

        return response;
    } catch (error) {
        throw error;
    }
};
const getUserCourseFeedback = async (user_id, course_id) => {
    try {
        const foundedFeedback = await prisma.feedbacks.findFirst({
            where: {
                user_id: user_id,
                course_id: course_id
            },
            include: {
                user: {
                    include: {
                        user_info: true
                    }
                }
            }
        });

        if (foundedFeedback) {
            const data = {
                id: foundedFeedback.id,
                course_id: foundedFeedback.course_id,
                user_id: foundedFeedback.user_id,
                context: foundedFeedback.context,
                created_at: foundedFeedback.created_at,
                updated_at: foundedFeedback.updated_at,
                rate: foundedFeedback.rate,
                is_confirmed: foundedFeedback.is_confirmed,
                is_deleted: foundedFeedback.is_deleted,
                reviewer: {
                    name: foundedFeedback.user.user_info?.name || '', // Use empty string if name is not available
                    family: foundedFeedback.user.user_info?.family || '', // Use empty string if family is not available
                    image: foundedFeedback.user.user_info?.image || '' // Use empty string if image is not available
                }
            };
            return data;
        } else {
            return {
                status: 'not found',
                message: 'Feedback not found'
            };
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addCourseFeedback,
    getCourseFeedback,
    notConfirmedCourseFeedback,
    getFeedbackById,
    deleteFeedbackById,
    updateFeedbackById,
    undeleteFeedbackById,
    confirmFeedbackById,
    getAllFeedback,
    getUserCourseFeedback
};
