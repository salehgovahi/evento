const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllCourses = async () => {
    try {
        let allCourses = await prisma.$queryRaw`
        SELECT courses.id, course_content.name, course_content.introduction, course_content.image, course_statistics.rate, 
            course_content .level, course_statistics.student_count, course_statistics.unit_count, course_statistics.recommended_time, 
            ARRAY_AGG(user_info.name || ' ' || user_info.family) AS teacher_names 
        FROM courses 
        LEFT JOIN course_content ON courses.content_id = course_content.id 
        LEFT JOIN course_statistics ON courses.statistics_id = course_statistics.id
        LEFT JOIN course_user ON courses.id = course_user.course_id 
        LEFT JOIN user_info ON course_user.user_id = user_info.user_id 
        WHERE courses.is_deleted = 'false'
        GROUP BY courses.id, course_content.name, course_content.introduction, course_content.image, course_statistics.rate, 
        course_content .level, course_statistics.student_count, course_statistics.unit_count, course_statistics.recommended_time
        ORDER BY course_statistics.rate ASC;
        `;

        // Transform the result to match the desired format
        const transformedCourses = allCourses.map((course) => ({
            id: course.id,
            name: course.name,
            introduction: course.introduction,
            image: course.image,
            rate: course.rate,
            level: course.level,
            student_count: course.student_count,
            unit_count: course.unit_count,
            recommended_time: course.recommended_time,
            teachers: course.teacher_names
        }));

        return transformedCourses;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getAllRoadmaps = async () => {
    try {
        const allRoadmaps = await prisma.roadmaps.findMany({
            where: {
                is_deleted: false
            },
            select: {
                id: true,
                title: true,
                course_count: true,
                color: true,
                icon: true
            }
        });

        return allRoadmaps;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getAllBootCamps = async (query) => {
    try {
        let { sort_by, sort_type } = query;
        if (!sort_by) {
            sort_by = 'created_at';
            sort_type = 'desc';
        }
        const allBootCamps = await prisma.bootcamps.findMany({
            where: {
                is_deleted: false
            },
            select: {
                id: true,
                image: true,
                gender: true,
                persian_title: true,
                english_title: true,
                description: true,
                signup_start_time: true,
                signup_end_time: true,
                start_time: true,
                end_time: true,
                class_hours: true,
                duration: true,
                color: true,
                status: true,
                capacity: true,
                url: true,
                educational_status: true,
                introduction: true,
                advertisement_video: true
            },
            orderBy: {
                [sort_by]: sort_type
            }
        });

        return allBootCamps;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    getAllCourses,
    getAllRoadmaps,
    getAllBootCamps
};
