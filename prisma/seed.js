const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const relatedDataUserInformation = require('../const/userInformationRelatedData');
const definedSkills = require('../const/definedSkills');

const admin_access_routes = [
    {
        access_name: 'events_add',
        access_path: '/events/content',
        access_method: 'POST'
    },
    {
        access_name: 'events_get_all',
        access_path: '/events/content',
        access_method: 'GET'
    },
    {
        access_name: 'events_get_by_id',
        access_path: '/events/content/#',
        access_method: 'GET'
    },
    {
        access_name: 'events_delete_by_id',
        access_path: '/events/content/#',
        access_method: 'DELETE'
    },
    {
        access_name: 'events_update_by_id',
        access_path: '/events/content/#',
        access_method: 'PATCH'
    },
    {
        access_name: 'events_undelete_by_id',
        access_path: '/events/content/#/undelete',
        access_method: 'PUT'
    },
    {
        access_name: 'events_upload_video',
        access_path: '/events/content/#/video',
        access_method: 'POST'
    },
    {
        access_name: 'events_upload_poster',
        access_path: '/events/content/#/poster',
        access_method: 'POST'
    },
    {
        access_name: 'events_participants_add',
        access_path: '/events/#/participants/',
        access_method: 'POST'
    },
    {
        access_name: 'events_participants_get_all',
        access_path: '/events/#/participants/',
        access_method: 'GET'
    },
    {
        access_name: 'events_speakers_add',
        access_path: '/events/#/speakers/',
        access_method: 'POST'
    },
    {
        access_name: 'events_speakers_get_all',
        access_path: '/events/#/speakers/',
        access_method: 'GET'
    },
    {
        access_name: 'events_speakers_get_by_id',
        access_path: '/events/#/speakers/#/',
        access_method: 'GET'
    },
    {
        access_name: 'events_speakers_update_by_id',
        access_path: '/events/#/speakers/#',
        access_method: 'PATCH'
    },
    {
        access_name: 'events_speakers_delete_by_id',
        access_path: '/events/#/speakers/#',
        access_method: 'DELETE'
    },
    {
        access_name: 'events_speakers_undelete_by_id',
        access_path: '/events/#/speakers/#/undelete',
        access_method: 'PUT'
    },
    {
        access_name: 'events_participants_update_indexes',
        access_path: '/events/#/participants/#/indexes',
        access_method: 'PUT'
    }
    
];

// const instructor_access_routes = [
//     {
//         access_name: 'bootcamps_homeworks_get_all',
//         access_path: '/bootcamps/#/days/#/sessions/#/homeworks/',
//         access_method: 'GET'
//     },
//     {
//         access_name: 'bootcamps_homeworks_update_by_id_admin',
//         access_path: '/bootcamps/#/days/#/sessions/#/homeworks/#',
//         access_method: 'PATCH'
//     }
// ];

const adminUsersData = [
    {
        name: 'Saleh',
        family: 'Govahi',
        email: 'saleh.govahi@gmail.com'
    },
];

// const testUsersData = [
//     {
//         name: 'Mohammad',
//         family: 'Alaei',
//         phone_number: '09123456789'
//     },
//     {
//         name: 'Hamed',
//         family: 'Salari',
//         phone_number: '09123456788'
//     },
//     {
//         name: 'Saleh',
//         family: 'Mohammadi',
//         phone_number: '09123456787'
//     }
// ];

const rewriteUrls = (routes) => {
    return routes.map((route) => {
        if (route.access_path.endsWith('#')) {
            route.access_path = route.access_path.endsWith('/')
                ? route.access_path.slice(0, -1)
                : route.access_path;
        } else {
            route.access_path = route.access_path.endsWith('/')
                ? route.access_path
                : route.access_path + '/';
        }
        return route;
    });
};

const updatedAdminAccessRoutes = rewriteUrls(admin_access_routes);
const combined_routes = [...updatedAdminAccessRoutes];
const unique_routes = Array.from(
    new Map(combined_routes.map((route) => [route.access_name, route])).values()
);

const addAccesses = async (access_routes) => {
    for (let route of access_routes) {
        try {
            const foundedAccess = await prisma.accesses.findFirst({
                where: {
                    name: route.access_name,
                    path: route.access_path,
                    method: route.access_method
                }
            });
            if (!foundedAccess) {
                const createdAccess = await prisma.accesses.create({
                    data: {
                        name: route.access_name,
                        path: route.access_path,
                        method: route.access_method
                    }
                });
                console.log(`Created: ${createdAccess.name}`);
            }
        } catch (error) {
            console.error(`Error processing route ${route.access_name}:`, error);
        }
    }
};

const createRole = async (role_name) => {
    let existingRole = await prisma.roles.findFirst({
        where: {
            name: role_name
        }
    });

    if (!existingRole) {
        await prisma.roles.create({
            data: {
                name: role_name
            }
        });
    }
};

const createUsers = async (usersData, role_name) => {
    const foundedRole = await prisma.roles.findFirst({
        where: {
            name: role_name,
            is_deleted: false
        }
    });

    for (let userData of usersData) {
        let existingUser = await prisma.user.findFirst({
            where: {
                email: userData.email
            }
        });
        if (!existingUser) {
            let createdUser = await prisma.user.create({
                data: {
                    email: userData.email
                }
            });
            await prisma.user_role.create({
                data: {
                    role_id: foundedRole.id,
                    user_id: createdUser.id
                }
            });
        } else {
            const foundedRole = await prisma.roles.findFirst({
                where: {
                    name: role_name,
                    is_deleted: false
                }
            });

            const hasThisRole = await prisma.user_role.findFirst({
                where: {
                    role_id: foundedRole.id,
                    user_id: existingUser.id
                }
            });

            if (!hasThisRole) {
                await prisma.user_role.create({
                    data: {
                        role_id: foundedRole.id,
                        user_id: existingUser.id
                    }
                });
            }
        }
    }
};

const assignAccessesToAdmin = async (role_name) => {
    const allAccesses = await prisma.accesses.findMany({});

    const foundedRole = await prisma.roles.findFirst({
        where: {
            name: role_name,
            is_deleted: false
        }
    });

    for (let access of allAccesses) {
        let existingAccess = await prisma.role_access.findMany({
            where: {
                role_id: foundedRole.id,
                access_id: access.id
            }
        });
        if (!existingAccess || existingAccess.length == 0) {
            await prisma.role_access.create({
                data: {
                    access_id: access.id,
                    role_id: foundedRole.id
                }
            });
        }
    }
};

// const assignAccessesToTeacher = async (role_name) => {
//     const allAccesses = await prisma.accesses.findMany({});

//     const foundedRole = await prisma.roles.findFirst({
//         where: {
//             name: role_name,
//             is_deleted: false
//         }
//     });

//     for (let access of allAccesses) {
//         if (
//             instructor_access_routes.some(
//                 (route) =>
//                     route.access_name === access.name &&
//                     route.access_method === access.method &&
//                     route.access_path === access.path
//             )
//         ) {
//             let existingAccess = await prisma.role_access.findMany({
//                 where: {
//                     role_id: foundedRole.id,
//                     access_id: access.id
//                 }
//             });
//             if (!existingAccess || existingAccess.length == 0) {
//                 await prisma.role_access.create({
//                     data: {
//                         access_id: access.id,
//                         role_id: foundedRole.id
//                     }
//                 });
//             }
//         }
//     }
// };

// const setBaseOfRelatedInformationOfUserInfo = async () => {
//     await prisma.$executeRaw`ALTER SEQUENCE study_fields_school_id_seq RESTART WITH 1000;`;
//     await prisma.$executeRaw`ALTER SEQUENCE school_levels_id_seq RESTART WITH 2000;`;
//     await prisma.$executeRaw`ALTER SEQUENCE study_fields_university_id_seq RESTART WITH 3000;`;
//     await prisma.$executeRaw`ALTER SEQUENCE university_levels_id_seq RESTART WITH 4000;`;
//     await prisma.$executeRaw`ALTER SEQUENCE military_status_id_seq RESTART WITH 5000;`;
//     await prisma.$executeRaw`ALTER SEQUENCE familiarity_ways_id_seq RESTART WITH 6000;`;
//     await prisma.$executeRaw`ALTER SEQUENCE defined_skills_id_seq RESTART WITH 7000;`;
//     await prisma.$disconnect();
// };

// const addProvinceAndCityToDb = async () => {
//     const Cities = relatedDataUserInformation.cities;

//     for (let city of Cities) {
//         let existingProvince = await prisma.provinces.findFirst({
//             where: { id: city.province_id }
//         });

//         if (!existingProvince) {
//             existingProvince = await prisma.provinces.create({
//                 data: {
//                     id: city.province_id,
//                     province_name: city.province_name
//                 }
//             });
//         }

//         let existingCity = await prisma.cities.findFirst({
//             where: {
//                 province_id: city.province_id,
//                 id: city.city_id
//             }
//         });

//         if (!existingCity) {
//             await prisma.cities.create({
//                 data: {
//                     id: city.city_id,
//                     province_id: city.province_id,
//                     province_name: city.province_name,
//                     city_name: city.name
//                 }
//             });
//         }
//     }
// };

// const addStudyFieldsToDb = async () => {
//     const universityFields = relatedDataUserInformation.fieldOfStudiesInUniversities;
//     const schoolFields = relatedDataUserInformation.fieldOfStudiesInSchools;

//     let counter = 3000;

//     for (let fieldName of universityFields) {
//         let existingField = await prisma.study_fields_university.findFirst({
//             where: { name: fieldName }
//         });

//         if (!existingField) {
//             existingField = await prisma.study_fields_university.create({
//                 data: {
//                     id: counter,
//                     name: fieldName
//                 }
//             });
//             counter++;
//         }
//     }

//     counter = 1000;

//     for (let fieldName of schoolFields) {
//         let existingField = await prisma.study_fields_school.findFirst({
//             where: { name: fieldName }
//         });

//         if (!existingField) {
//             existingField = await prisma.study_fields_school.create({
//                 data: {
//                     id: counter,
//                     name: fieldName
//                 }
//             });
//             counter++;
//         }
//     }
// };

// const addStudyLevelsToDb = async () => {
//     const universityLevels = relatedDataUserInformation.university_levels;
//     const schoolLevels = relatedDataUserInformation.school_levels;

//     let counter = 4000;

//     for (let levelName of universityLevels) {
//         let existingField = await prisma.university_levels.findFirst({
//             where: { name: levelName }
//         });

//         if (!existingField) {
//             existingField = await prisma.university_levels.create({
//                 data: {
//                     id: counter,
//                     name: levelName
//                 }
//             });
//             counter++;
//         }
//     }

//     counter = 2000;

//     for (let levelName of schoolLevels) {
//         let existingField = await prisma.school_levels.findFirst({
//             where: { name: levelName }
//         });

//         if (!existingField) {
//             existingField = await prisma.school_levels.create({
//                 data: {
//                     id: counter,
//                     name: levelName
//                 }
//             });
//             counter++;
//         }
//     }
// };

// const addMilitaryStatusToDb = async () => {
//     const military_statuses = relatedDataUserInformation.military_status;

//     let counter = 5000;

//     for (let statusName of military_statuses) {
//         let existingField = await prisma.military_status.findFirst({
//             where: { name: statusName }
//         });

//         if (!existingField) {
//             existingField = await prisma.military_status.create({
//                 data: {
//                     id: counter,
//                     name: statusName
//                 }
//             });
//             counter++;
//         }
//     }
// };

// const addFamiliarityWaysToDb = async () => {
//     const familiarity_ways = relatedDataUserInformation.familiarity_ways;

//     let counter = 6000;

//     for (let wayName of familiarity_ways) {
//         let existingField = await prisma.familiarity_ways.findFirst({
//             where: { name: wayName }
//         });

//         if (!existingField) {
//             existingField = await prisma.familiarity_ways.create({
//                 data: {
//                     id: counter,
//                     name: wayName
//                 }
//             });
//             counter++;
//         }
//     }
// };
// const initBootCampStatus = async () => {
//     let AllStatus = ['تایید برای مصاحبه', 'رد', 'بررسی مجدد'];
//     for (const title of AllStatus) {
//         const foundedStatus = await prisma.bootcamp_review_status.findFirst({
//             where: {
//                 title: title,
//                 is_deleted: false
//             }
//         });
//         if (!foundedStatus) {
//             await prisma.bootcamp_review_status.create({
//                 data: {
//                     title: title
//                 }
//             });
//         }
//     }
// };

// const addDefinedSkills = async (skills) => {
//     for (const skill of skills) {
//         const foundedSkill = await prisma.defined_skills.findFirst({
//             where: {
//                 name: skill
//             }
//         });
//         if (!foundedSkill) {
//             await prisma.defined_skills.create({
//                 data: {
//                     name: skill
//                 }
//             });
//         }
//     }
// };

const runAll = async () => {
    await addAccesses(unique_routes);
    // Admin
    await createRole('admin');
    await createUsers(adminUsersData, 'admin');
    await assignAccessesToAdmin('admin');
    // Teacher
    // await createRole('instructor');
    // await assignAccessesToTeacher('instructor');
    // Student
    await createRole('participant');
    // await createUsers(testUsersData, 'student');
    // await setBaseOfRelatedInformationOfUserInfo();
    // await addProvinceAndCityToDb();
    // await addStudyFieldsToDb();
    // await addStudyLevelsToDb();
    // await addMilitaryStatusToDb();
    // await addFamiliarityWaysToDb();
    // await initBootCampStatus();
    // await addDefinedSkills(definedSkills['skills']);
};

runAll();
