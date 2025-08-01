const HttpError = require('../../utils/httpError');
const Errors = require('../../const/errors');
const dbFunctions = require('./dbFunctions');
const crypto = require('node:crypto');
const roleDbFunctions = require('../roles/dbFunctions');
const bootcampStudentsDbFunctions = require('../bootcamps/students/dbFunctions');
const bootcampDbFunctions = require('../bootcamps/content/dbFunctions');
const { sendSms } = require('../../utils/sendSms');

const createUser = async (req, res, next) => {
    const { phone_number, name, family } = req.body;

    try {
        let existingUser = await dbFunctions.getUserByPhoneNumber(phone_number);
        if (existingUser) {
            const error = new HttpError(Errors.Phone_Number_Is_Duplicate);
            return next(error);
        }

        const createdUser = await dbFunctions.createUser(phone_number, name, family);

        res.status(201).json({
            status: 'success',
            result: createdUser
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const completeInformation = async (req, res, next) => {
    const { user_id, phone_number, name, family } = req.body;

    try {
        let existingUser = await dbFunctions.getUserById(user_id);
        if (!existingUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        const updatedInfo = await dbFunctions.compeleteUserInformation(
            user_id,
            phone_number,
            name,
            family
        );

        res.status(200).json({
            status: 'success',
            result: updatedInfo
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const sendSmsToUsers = async (req, res, next) => {
    const { context, exclude_bootcamp_ids } = req.body;

    try {
        for (let bootcamp_id of exclude_bootcamp_ids) {
            const foundedBootCamp = await bootcampDbFunctions.getBootCampById(bootcamp_id);
            if (!foundedBootCamp) {
                const error = new HttpError(Errors.BootCamp_Undefined);
                return next(error);
            }
        }

        const enrolledStudents = await Promise.all(
            exclude_bootcamp_ids.map((bootcamp_id) =>
                bootcampStudentsDbFunctions.getAllStudentsOfABootCamp(bootcamp_id)
            )
        );

        const excludedUserIds = enrolledStudents.flat().map((student) => student.user_id);

        let allUsers = await dbFunctions.getAllUsers();

        const filteredUsers = allUsers.filter((user) => !excludedUserIds.includes(user.id));

        const personalizedMessages = filteredUsers.map((user) => {
            const userName = user.name || 'دوست';
            const userFamily = user.family || '';

            return context.replace(/{user.name}/g, userName).replace(/{user.family}/g, userFamily);
        });

        res.status(200).json({
            status: 'success'
        });

        const failedMessages = [];
        let failedSendingSmsCount = 0;

        await Promise.all(
            filteredUsers.map((user, index) => {
                return sendSms(personalizedMessages[index], user.phone_number).catch(() => {
                    failedMessages.push(user.phone_number);
                    failedSendingSmsCount++;
                });
            })
        );
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        let allUsers = await dbFunctions.getAllUsers();

        res.status(200).json({
            status: 'success',
            result: allUsers
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getUserById = async (req, res, next) => {
    const id = req.params.user_id;

    try {
        let foundedUser = await dbFunctions.getUserById(id);
        if (!foundedUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            result: foundedUser
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getAccessesOfAUser = async (req, res, next) => {
    const id = req.params.user_id;

    try {
        let foundedUser = await dbFunctions.getUserById(id);
        if (!foundedUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        const foundedAccesses = await dbFunctions.getAccessesOfAUser(id);

        res.status(200).json({
            status: 'success',
            result: foundedAccesses
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const updateUserPut = async (req, res, next) => {
    const user_id = req.params.user_id;
    const {
        phone_number,
        name,
        family,
        birth_date,
        national_id,
        gender,
    } = req.body;

    try {
        const existingUser = dbFunctions.getUserById(user_id);
        if (!existingUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        const userWithPhoneNumber = await dbFunctions.getUserByPhoneNumber(phone_number);
        if (userWithPhoneNumber) {
            if (existingUser.phone_number != phone_number) {
                const error = new HttpError(Errors.Phone_Number_Is_Duplicate);
                return next(error);
            }
        }

        const updatedUser = await dbFunctions.updateUser(
            user_id,
            phone_number,
            name,
            family,
            birth_date,
            national_id,
            gender
        );

        let hashedPassword;
        if (password) {
            hashedPassword = crypto.createHash('md5').update(password).digest('hex');
            await dbFunctions.setUserPassword(user_id, hashedPassword);
        }

        res.status(200).json({
            status: 'success',
            result: updatedUser
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const updateUserPatch = async (req, res, next) => {
    const user_id = req.params.user_id;
    const {
        phone_number,
        name,
        family,
        birth_date,
        national_id,
        gender,
        role_ids
    } = req.body;

    try {
        if (phone_number) {
            const existsUserBefore = await dbFunctions.getUserByPhoneNumber(phone_number);
            if (existsUserBefore && existsUserBefore.id != user_id) {
                return next(new HttpError(Errors.User_Exists));
            }
        }

        const [existingUser, existingUserInfo] = await Promise.all([
            dbFunctions.getUserById(user_id),
            dbFunctions.getUserInfoById(user_id)
        ]);

        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        const updatedUserData = {
            phone_number: phone_number || existingUserInfo.phone_number,
            name: name || existingUserInfo.name,
            family: family || existingUserInfo.family,
            birth_date: birth_date || existingUserInfo.birth_date,
            national_id: national_id || existingUserInfo.national_id,
            gender: gender || existingUserInfo.gender,
        };

        const updatedUser = await dbFunctions.updateUser(user_id, phone_number, updatedUserData);

        if (role_ids) {
            await roleDbFunctions.assignRoleToUser(user_id, role_ids);
        }

        res.status(200).json({
            status: 'success',
            result: updatedUser
        });
    } catch (err) {
        console.error(err);
        return next(new HttpError(Errors.Something_Went_Wrong));
    }
};

const updateUserPhoneNumber = async (req, res, next) => {
    const { phone_number } = req.body;
    const user_id = req.params.user_id;

    try {
        const existingUser = dbFunctions.getUserById(user_id);
        if (!existingUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        let existingNumber = await dbFunctions.getUserByPhoneNumber(phone_number);
        if (existingNumber) {
            const error = new HttpError(Errors.Phone_Number_Is_Duplicate);
            return next(error);
        }

        const updatedUser = await dbFunctions.setUserPhoneNumber(user_id, phone_number);

        res.status(200).json({
            status: 'success',
            result: updatedUser
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const setPassword = async (req, res, next) => {
    const { user_id, password } = req.body;

    try {
        const existingUser = dbFunctions.getUserById(user_id);
        if (!existingUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        let hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        const updatedUser = await dbFunctions.setUserPassword(user_id, hashedPassword);

        res.status(200).json({
            status: 'success',
            result: []
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const deleteUserById = async (req, res, next) => {
    const id = req.params.id;

    try {
        let foundedUser = await dbFunctions.getUserById(id);
        if (!foundedUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }
        if (foundedUser.name == 'admin') {
            const error = new HttpError(Errors.Not_Delete_Admin_Role);
            return next(error);
        }

        const deletedUser = await dbFunctions.deleteUserById(foundedUser.id);

        res.status(200).json({
            status: 'success',
            result: deletedUser
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};
const undeleteUserById = async (req, res, next) => {
    const id = req.params.id;

    try {
        let foundedUser = await dbFunctions.getUserById(id);
        if (!foundedUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        const deletedUser = await dbFunctions.undeleteUserById(foundedUser.id);

        res.status(200).json({
            status: 'success',
            result: deletedUser
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const searchUsers = async (req, res, next) => {
    try {
        const query = req.query || {};
        const filters = [
            {
                value: query.parameter,
                condition: (value) => ({
                    OR: [
                        { name: { contains: value, mode: 'insensitive' } },
                        { family: { contains: value, mode: 'insensitive' } }
                    ]
                })
            },
            { value: query.gender, condition: (value) => ({ gender: value }) },
            { value: query.nationality, condition: (value) => ({ nationality: value }) },
            {
                value: query.educational_status,
                condition: (value) => ({ educational_status: value })
            },
            {
                value: query.employment_status,
                condition: (value) => ({ employment_status: value })
            },
            {
                value: query.institution_name,
                condition: (value) => ({ institution_name: { contains: value } })
            },
            { value: query.province, condition: (value) => ({ province: value }) },
            { value: query.city, condition: (value) => ({ city: value }) },
            { value: query.is_deleted, condition: (value) => ({ is_deleted: value }) },
            { value: query.birth_date, condition: (value) => ({ birth_date: value }) },
            { value: query.national_id, condition: (value) => ({ national_id: value }) },
            {
                value: query.educational_level,
                condition: (value) => ({ educational_level: { equals: +value } })
            },
            {
                value: query.field_of_study,
                condition: (value) => ({ field_of_study: { equals: +value } })
            },
            {
                value: query.military_status,
                condition: (value) => ({ military_status: { equals: +value } })
            },
            {
                value: query.familiarity_way,
                condition: (value) => ({ familiarity_way: { equals: +value } })
            }
        ]
            .filter((item) => item.value)
            .map((item) => ({
                OR: item.value.split(',').map(item.condition)
            }));

        const where = {
            user_info: {
                AND: filters
            },
            user_roles: query.role
                ? {
                      some: {
                          roles: {
                              OR: query.role
                                  ? query.role
                                        .split(',')
                                        .map((role) => ({ name: { equals: role } }))
                                  : []
                          }
                      }
                  }
                : undefined,
            profile: query.profile_status
                ? {
                      status: {
                          equals: query.profile_status
                      }
                  }
                : undefined
        };

        const total = await dbFunctions.getUserCount({ where });
        const users = await dbFunctions.getUserByFilter({
            where,
            include: {
                user_info: true,
                user_roles: {
                    select: {
                        roles: true
                    }
                },

                profile: true
            },
            skip: (query.page - 1) * query.limit,
            take: query.limit
        });

        const data = users.map((user) => {
            const userInfo = user.user_info;
            return {
                ...userInfo,
                id: user.id,
                phone_number: user.phone_number,
                is_deleted: user.is_deleted,
                roles: user.user_roles.map((userRole) => userRole.roles.id),
                profile_status: user.profile?.status,
                profile_id: user.profile?.id
            };
        });

        res.status(200).json({
            status: 'success',
            result: {
                total,
                totalPages: Math.ceil(total / query.limit),
                currentPage: +query.page,
                data
            }
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getUsersDailyRegistrationCount = async (req, res, next) => {
    try {
        const { start_date, end_date } = req.query;
        const endDate = end_date ? new Date(end_date) : new Date();
        const startDate = start_date
            ? new Date(start_date)
            : new Date(new Date().setDate(new Date().getDate() - 15));

        if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate || endDate > new Date()) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const users = await dbFunctions.getUserByFilter({
            include: {
                user_info: {
                    select: {
                        created_at: true
                    }
                }
            },
            where: {
                user_info: {
                    created_at: {
                        gte: startDate,
                        lte: endDate
                    }
                }
            }
        });

        const dateArray = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dateArray.push({ date: currentDate.toISOString().split('T')[0], count: 0 });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const userDateCounts = users.reduce((acc, user) => {
            const userDate = new Date(user.user_info.created_at).toISOString().split('T')[0];
            acc[userDate] = (acc[userDate] || 0) + 1;
            return acc;
        }, {});

        const result = dateArray.map((item) => ({
            date: item.date,
            count: userDateCounts[item.date] || 0
        }));

        res.status(200).json({ result });
    } catch (err) {
        console.error(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getUsersOverview = async (req, res, next) => {
    try {
        const totalManUsers = await dbFunctions.getUserCount({
            where: { user_info: { gender: 'M' } }
        });
        const totalWomenUsers = await dbFunctions.getUserCount({
            where: { user_info: { gender: 'F' } }
        });
        const totalUsers = await dbFunctions.getUserCount({});
        const totalStudents = await dbFunctions.getUserCount({
            where: {
                user_roles: {
                    some: {
                        roles: {
                            name: {
                                equals: 'student'
                            }
                        }
                    }
                }
            }
        });
        const totalTeachers = await dbFunctions.getUserCount({
            where: {
                user_roles: {
                    some: {
                        roles: {
                            name: {
                                equals: 'teacher'
                            }
                        }
                    }
                }
            }
        });

        res.status(200).json({
            status: 'success',
            result: {
                totalManUsers,
                totalWomenUsers,
                totalStudents,
                totalTeachers,
                totalUsers
            }
        });
    } catch (err) {
        console.error(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    createUser,
    completeInformation,
    getAllUsers,
    getUserById,
    sendSmsToUsers,
    getAccessesOfAUser,
    updateUserPut,
    updateUserPatch,
    updateUserPhoneNumber,
    setPassword,
    deleteUserById,
    undeleteUserById,
    searchUsers,
    getUsersDailyRegistrationCount,
    getUsersOverview
};
