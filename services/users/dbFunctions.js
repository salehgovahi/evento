const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCurrentTime = require('../../utils/timeUtil');

const createPreUserToConfirm = async (initialUser) => {
    try {
        const preUser = await prisma.confirm_signup.create({
            data: {
                email: initialUser.email,
                password: initialUser.password,
                verification_code: initialUser.verification_code,
                created_at: initialUser.created_at,
                expired_at: initialUser.expired_at
            }
        });

        return preUser;
    } catch (err) {
        throw err;
    }
};

const getPreUserByPhoneNumber = async (email) => {
    try {
        const user = await prisma.confirm_signup.findMany({
            where: {
                email: email
            }
        });

        return user;
    } catch (error) {
        throw error;
    }
};

const getPreUser = async (verification_id) => {
    try {
        const user = await prisma.confirm_signup.findFirst({
            where: {
                verification_id: verification_id
            }
        });

        return user;
    } catch (error) {
        throw error;
    }
};

const getNumberOfVerifications = async (email) => {
    try {
        let tryCount = 0;

        const verifications = await prisma.verifications.findMany({
            where: {
                email: email
            }
        });

        if (verifications) {
            for (let verification of verifications) {
                let createdAt = Math.floor(new Date(verification.created_at).getTime() / 1000);
                if (getCurrentTime() - 60 * 10 < createdAt) {
                    tryCount++;
                }
            }
        }

        return tryCount;
    } catch (error) {
        throw error;
    }
};

const deletePreUser = async (email) => {
    try {
        const deletedUser = await prisma.confirm_signup.deleteMany({
            where: { email: email }
        });

        return deletedUser;
    } catch (error) {
        throw error;
    }
};

const getUserByEmail = async (email) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
                is_deleted: false
            }
        });

        return user;
    } catch (error) {
        throw error;
    }
};

const createUser = async (email) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: email
            }
        });

        return user;
    } catch (error) {
        throw error;
    }
};

const getUserById = async (id) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: id
            }
        });


        return user;
    } catch (error) {
        throw error;
    }
};

const getRoleOfUser = async (id) => {
    try {
        const role = await prisma.$queryRaw`
        SELECT public.user_role.role_id FROM public.user_role
        where public.user_role.user_id::text = ${id}
        ORDER BY id ASC;`;

        return role;
    } catch (error) {
        throw error;
    }
};

const getAccessesOfAUser = async (id) => {
    try {
        let foundedAccesses = prisma.$queryRaw`
        SELECT 
	        public.user.id, accesses.name As access_name, accesses.path As access_path, accesses.method As access_method
	        FROM public.user
	        left join user_role on public.user.id = user_role.user_id
	        left join roles on user_role.user_id = roles.id
	        left join role_access on roles.id = role_access.role_id
	        left join accesses on role_access.access_id = accesses.id
	        where roles.is_deleted = false and accesses.is_deleted = false
        ORDER BY roles.role_name ASC;`;

        return foundedAccesses;
    } catch (error) {
        throw error;
    }
};

const getUserInfoById = async (user_id) => {
    try {
        const foundedUser = await prisma.user_info.findFirst({
            where: {
                user_id: user_id
            }
        });

        return foundedUser;
    } catch (error) {
        throw error;
    }
};

const updateUser = async (user_id, email, data) => {
    try {
        if (email) {
            await prisma.user.update({
                where: {
                    id: user_id
                },
                data: {
                    email: email
                }
            });
        }
        const result = await prisma.user_info.update({
            where: {
                user_id: user_id
            },
            data: {
                ...data
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

const setUserPhoneNumber = async (user_id, email) => {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: user_id
            },
            data: {
                email: email
            }
        });

        await prisma.user_info.update({
            where: {
                user_id: user_id
            },
            data: {
                email: email
            }
        });

        return updatedUser;
    } catch (error) {
        throw error;
    }
};

const setUserPassword = async (user_id, password) => {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: user_id
            },
            data: {
                password: password
            }
        });

        return updatedUser;
    } catch (error) {
        throw error;
    }
};

const getAllUsers = async () => {
    try {
        const allUsers = await prisma.$queryRaw`
        SELECT 
            public.user.id,
            public.user.email,
            public.user_info.name,
            public.user_info.family,
            public.user_info.created_at,
            public.user.is_deleted,
            CASE 
                WHEN COUNT(public.user_info.id) > 0 
                THEN ARRAY_AGG(public.user_role.role_id::text)
                ELSE ARRAY[]::text[]
            END AS roles
        FROM public.user
        LEFT JOIN public.user_info ON public.user.id = public.user_info.user_id
        LEFT JOIN public.user_role ON public.user.id = public.user_role.user_id
        GROUP BY public.user.id, public.user.email, public.user_info.name, public.user_info.family, public.user_info.created_at, public.user.is_deleted
        ORDER BY public.user_info.name ASC`;

        return allUsers;
    } catch (error) {
        throw error;
    }
};

const wrongVerificationCodeIncrement = async (verification_id) => {
    try {
        await prisma.confirm_signup.update({
            where: { verification_id: verification_id },
            data: {
                wrong_password_times: {
                    increment: 1
                }
            }
        });
    } catch (error) {
        throw error;
    }
};

const createForgetPasswordRecord = async (
    email,
    newVerificationCode,
    expireTime,
    timeToChange
) => {
    try {
        const user = await prisma.forget_password.create({
            data: {
                email: email,
                verification_code: newVerificationCode,
                expired_at: expireTime,
                time_to_change: timeToChange
            }
        });

        return user;
    } catch (error) {
        throw error;
    }
};

const getVerificationCodeOfUser = async (email) => {
    try {
        const user = await prisma.forget_password.findMany({
            where: {
                email: email,
                is_used: false
            }
        });

        return user;
    } catch (error) {
        throw error;
    }
};

const setUsedVerificationCodeForgetPassword = async (id) => {
    try {
        const user = await prisma.forget_password.update({
            where: {
                id: id
            },
            data: {
                is_used: true
            }
        });

        return user;
    } catch (error) {
        throw error;
    }
};

const changePassword = async (email, newPassword) => {
    try {
        const user = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: newPassword
            }
        });

        return user;
    } catch (error) {
        throw error;
    }
};

const compeleteUserInformation = async (user_id, email, name, family) => {
    try {
        const compeletedInfo = await prisma.user_info.update({
            where: {
                email: email
            },
            data: {
                name: name,
                family: family
            }
        });

        return compeletedInfo;
    } catch (error) {
        throw error;
    }
};

const createWrongPasswordLoginRecord = async (email, expired_at) => {
    try {
        const record = await prisma.wrong_password_login.create({
            data: {
                email: email,
                expired_at: new Date(Date.now() + expired_at).toISOString()
            }
        });
    } catch (error) {
        throw error;
    }
};

const getWrongPasswordLoginRecord = async (email) => {
    try {
        let tryCount = 0;
        const records = await prisma.wrong_password_login.findMany({
            where: {
                email: email
            }
        });

        for (let record of records) {
            const expireTime = Math.floor(new Date(record.expired_at).getTime() / 1000);

            const currentTime = getCurrentTime();

            if (currentTime < expireTime) {
                tryCount++;
            }
        }

        return tryCount;
    } catch (error) {
        throw error;
    }
};

const getUserInformation = async (user_id) => {
    try {
        let userInformation = await prisma.user_info.findFirst({
            where: {
                user_id: user_id
            }
        });

        return userInformation;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const deleteUserById = async (id) => {
    try {
        await prisma.user_role.updateMany({
            where: {
                role_id: id
            },
            data: {
                is_deleted: true
            }
        });

        const deletedUser = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                is_deleted: true
            }
        });

        return deletedUser;
    } catch (error) {
        throw error;
    }
};

const undeleteUserById = async (id) => {
    try {
        await prisma.user_role.updateMany({
            where: {
                role_id: id
            },
            data: {
                is_deleted: false
            }
        });
        const deletedUser = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                is_deleted: false
            }
        });

        return deletedUser;
    } catch (error) {
        throw error;
    }
};

const searchUsers = async (searchParameter, page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;

        const searchedUsers = await prisma.user.findMany({
            where: {
                user_info: {
                    OR: [
                        { name: { contains: searchParameter, mode: 'insensitive' } },
                        { family: { contains: searchParameter, mode: 'insensitive' } }
                    ]
                }
            },
            skip: skip,
            take: limit,
            include: {
                user_info: true,
                user_roles: {
                    select: {
                        roles: {
                            select: {
                                id: true
                                // You can select other fields from the roles table here
                            }
                        }
                    }
                }
            }
        });

        const total = await prisma.user.count({
            where: {
                user_info: {
                    OR: [
                        { name: { contains: searchParameter, mode: 'insensitive' } },
                        { family: { contains: searchParameter, mode: 'insensitive' } }
                    ]
                }
            }
        });

        const totalPages = Math.ceil(total / limit);

        return {
            total,
            totalPages,
            currentPage: page,
            data: searchedUsers.map((user) => ({
                id: user.id,
                email: user.email,
                name: user.user_info?.name,
                family: user.user_info?.family,
                created_at: user.user_info?.created_at,
                is_deleted: user.is_deleted,
                birth_date: user.user_info?.birth_date,
                national_id: user.user_info?.national_id,
                gender: user.user_info?.gender,
                province: user.user_info?.province,
                city: user.user_info?.city,
                nationality: user.user_info?.nationality,
                passport_number: user.user_info?.passport_number,
                about_me: user.user_info?.about_me,
                educational_status: user.user_info?.educational_status,
                institution_name: user.user_info?.institution_name,
                educational_level: user.user_info?.educational_level,
                field_of_study: user.user_info?.field_of_study,
                employment_status: user.user_info?.employment_status,
                job_title: user.user_info?.job_title,
                military_status: user.user_info?.military_status,
                familiarity_way: user.user_info?.familiarity_way,
                linkedin_address: user.user_info?.linkedin_address,
                motivation_letter: user.user_info?.motivation_letter,
                cv: user.user_info?.cv,
                image: user.user_info?.image,
                roles: user.user_roles.map((userRole) => userRole.roles.id) // Adjust if you need more role fields
            }))
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getUserCount = async ({ where, orderBy, skip, take }) => {
    try {
        const totalUsers = await prisma.user.count({
            where,
            orderBy,
            skip,
            take
        });
        return totalUsers;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getUserByFilter = async ({ where, orderBy, include, select, skip, take }) => {
    try {
        take = parseInt(take || 16);
        const totalUsers = await prisma.user.findMany({
            where,
            orderBy,
            include,
            select,
            skip,
            take
        });

        return totalUsers;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    createPreUserToConfirm,
    getPreUser,
    getNumberOfVerifications,
    deletePreUser,
    getUserByEmail,
    createUser,
    getUserById,
    getUserInfoById,
    deleteUserById,
    getRoleOfUser,
    getAccessesOfAUser,
    getAllUsers,
    updateUser,
    wrongVerificationCodeIncrement,
    createForgetPasswordRecord,
    getVerificationCodeOfUser,
    changePassword,
    setUsedVerificationCodeForgetPassword,
    compeleteUserInformation,
    createWrongPasswordLoginRecord,
    getWrongPasswordLoginRecord,
    setUserPhoneNumber,
    setUserPassword,
    getUserInformation,
    undeleteUserById,
    searchUsers,
    getUserCount,
    getUserByFilter
};
