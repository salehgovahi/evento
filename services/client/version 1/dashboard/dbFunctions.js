const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMyCourses = async (user_id) => {
    try {
        const foundedCourses = await prisma.course_user.findMany({
            where: {
                user_id: user_id
            },
            include: {
                course: {
                    include: {
                        course_content: true
                    }
                }
            }
        });
        return foundedCourses.map((courseUser) => ({
            id: courseUser.course.id,
            name: courseUser.course.course_content.name,
            level: courseUser.course.course_content.level,
            image: courseUser.course.course_content.image,
            introduction: courseUser.course.course_content.introduction,
            advertisement_video: courseUser.course.course_content.advertisement_video,
            learning_topics: courseUser.course.course_content.learning_topics,
            learning_skills: courseUser.course.course_content.learning_skills,
            contacts: courseUser.course.course_content.contacts,
            requirements: courseUser.course.course_content.requirements,
            description: courseUser.course.course_content.description,
            faqs: courseUser.course.course_content.faqs
        }));
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getMyCertificates = async (user_id) => {
    try {
        const foundedCertificates = await prisma.bootcamps_students.findMany({
            where: {
                user_id: user_id,
                certificate: {
                    not: null
                }
            },
            select: {
                bootcamp_id: true,
                bootcamp: {
                    select: {
                        english_title: true,
                        persian_title: true
                    }
                },
                certificate: true,
                certificate_serial: true
            }
        });

        if (foundedCertificates.length === 0) {
            return [];
        }

        return foundedCertificates.map((cert) => ({
            course_id: cert.bootcamp_id,
            english_title: cert.bootcamp.english_title,
            persian_title: cert.bootcamp.persian_title,
            certificate: cert.certificate,
            certificate_serial: cert.certificate_serial
        }));
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getMyQuestions = async (user_id) => {
    try {
        const foundedQuestions = await prisma.unit_questions.findMany({
            where: {
                user_id: user_id
            },
            include: {
                user: {
                    select: {
                        user_info: {
                            select: {
                                name: true,
                                family: true,
                                image: true
                            }
                        }
                    }
                },
                units: {
                    select: {
                        title: true,
                        chapters: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            }
        });
        const formattedQuestions = foundedQuestions.map((question) => ({
            ...question,
            user: {
                name: question.user?.user_info?.name,
                family: question.user?.user_info?.family,
                image: question.user?.user_info?.image
            }
        }));
        return formattedQuestions;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getMyBootCamps = async (user_id, page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;

        const foundedBootcamps = await prisma.$queryRaw`
            SELECT DISTINCT ON (bootcamp_id) *
            FROM (
                (
                    SELECT
                        b.id AS bootcamp_id,
                        b.persian_title,
                        b.english_title,
                        b.introduction,
                        b.image,
                        b.poster,
                        b.catalog,
                        b.description,
                        b.status,
                        b.is_deleted,
                        b.capacity,
                        b.class_hours,
                        b.color,
                        b.duration,
                        b.is_active,
                        b.pre_title,
                        b.start_time,
                        b.gender,
                        b.url,
                        b.end_time,
                        b.signup_end_time,
                        b.signup_start_time,
                        b.educational_status,
                        b.created_at AS created_at,
                        bs.user_id,
                        bs.steps,
                        'student' AS user_role
                    FROM
                        bootcamps b
                    JOIN
                        bootcamps_students bs ON b.id::text = bs.bootcamp_id::text
                    WHERE
                        b.is_deleted = false
                        AND (bs.user_id::text = ${user_id}::text)
                )
                UNION
                (
                    SELECT
                        b.id AS bootcamp_id,
                        b.persian_title,
                        b.english_title,
                        b.introduction,
                        b.image,
                        b.poster,
                        b.catalog,
                        b.description,
                        b.status,
                        b.is_deleted,
                        b.capacity,
                        b.class_hours,
                        b.color,
                        b.duration,
                        b.is_active,
                        b.pre_title,
                        b.start_time,
                        b.gender,
                        b.url,
                        b.end_time,
                        b.signup_end_time,
                        b.signup_start_time,
                        b.educational_status,
                        b.created_at AS created_at,
                        bc.user_id,
                        NULL AS steps,
                        'committee' AS user_role
                    FROM
                        bootcamps b
                    JOIN
                        bootcamps_committee bc ON b.id::text = bc.bootcamp_id::text
                    WHERE
                        b.is_deleted = false
                        AND (bc.user_id::text = ${user_id}::text)
                )
            ) combined
            ORDER BY
                bootcamp_id, 
                CASE WHEN user_role = 'committee' THEN 1 ELSE 2 END  -- Prefer committee role if both exist
            LIMIT 
                ${limit} OFFSET ${skip}`;

        const totalStudents = await prisma.bootcamps_students.count({
            where: {
                user_id,
                bootcamp: {
                    is_deleted: false
                }
            }
        });

        const totalCommittee = await prisma.bootcamps_committee.count({
            where: {
                user_id,
                bootcamp_id: {
                    in: await prisma.bootcamps
                        .findMany({
                            where: {
                                is_deleted: false
                            },
                            select: {
                                id: true
                            }
                        })
                        .then((bootcamps) => bootcamps.map((b) => b.id))
                }
            }
        });

        const total = totalStudents + totalCommittee;

        const totalPages = Math.ceil(total / limit);

        return {
            total,
            totalPages,
            currentPage: page,
            result: foundedBootcamps
        };
    } catch (err) {
        throw err;
    }
};
module.exports = {
    getMyCourses,
    getMyCertificates,
    getMyQuestions,
    getMyBootCamps
};
