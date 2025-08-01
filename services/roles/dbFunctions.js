const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const userDbFunctions = require('../users/dbFunctions');

const createRole = async (role_name) => {
    try {
        const createdRole = await prisma.roles.create({
            data: {
                name: role_name
            }
        });

        return createdRole;
    } catch (error) {
        throw error;
    }
};

const assignRoleToUser = async (user_id, role_ids) => {
    try {
        let rolesOfUser = await getRoleOfUser(user_id);

        let rolesOfAUser = Array.isArray(rolesOfUser)
            ? rolesOfUser.map((role) => role.role_id)
            : [];

        for (let role_id of role_ids) {
            if (await getRoleById(role_id)) {
                if (!rolesOfAUser.includes(role_id)) {
                    await prisma.user_role.create({
                        data: {
                            role_id: role_id,
                            user_id: user_id
                        }
                    });
                }
                rolesOfAUser = rolesOfAUser.filter((item) => item !== role_id);
            }
        }

        for (let remainingRole of rolesOfAUser) {
            await prisma.user_role.deleteMany({
                where: {
                    role_id: remainingRole,
                    user_id: user_id
                }
            });
        }

        const newUserRole = await getRoleOfUser(user_id);

        return newUserRole;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const unAssignRoleFromUser = async (userId, roleId) => {
    try {
        const deletedAssignment = await prisma.user_role.deleteMany({
            where: {
                user_id: userId,
                role_id: roleId
            }
        });

        return deletedAssignment;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getAssignedRolesToUser = async (userId, roleId) => {
    try {
        const foundedAssignedRoles = await prisma.user_role.findFirst({
            where: {
                user_id: userId,
                role_id: roleId
            }
        });

        return foundedAssignedRoles;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getRoleByName = async (role_name) => {
    try {
        const foundedRole = await prisma.roles.findFirst({
            where: {
                name: role_name,
                is_deleted: false
            }
        });

        return foundedRole;
    } catch (error) {
        throw error;
    }
};

const getAllRoles = async () => {
    try {
        const foundedRoles = await prisma.roles.findMany({});

        const rolesWithUserCounts = await Promise.all(
            foundedRoles.map(async (role) => {
                const userCount = await prisma.user_role.count({
                    where: {
                        role_id: role.id,
                        is_deleted: false
                    }
                });

                return {
                    ...role,
                    user_count: userCount
                };
            })
        );

        return rolesWithUserCounts;
    } catch (error) {
        throw error;
    }
};

const getRoleById = async (id) => {
    try {
        const foundedRole = await prisma.roles.findFirst({
            where: {
                id: id
            }
        });

        return foundedRole;
    } catch (error) {
        throw error;
    }
};

const getAccessesOfARole = async (role_id) => {
    try {
        const accesses = await prisma.$queryRaw`
        SELECT 
            accesses.id AS access_id
        FROM public.roles
        left join role_access on roles.id = role_access.role_id
        left join accesses on role_access.access_id = accesses.id
        where roles.is_deleted = false and accesses.is_deleted = false and roles.id::text = ${role_id}
        ORDER BY roles.name ASC;
        `;

        const accessIDs = accesses.map((access) => access.access_id);

        return accessIDs;
    } catch (error) {
        throw error;
    }
};

const getAccessNameOfARole = async (role_id) => {
    try {
        const accesses = await prisma.$queryRaw`
            SELECT 
                accesses.name As access_name
            FROM public.roles
            left join role_access on roles.id = role_access.role_id
            left join accesses on role_access.access_id = accesses.id
            where roles.is_deleted = false and accesses.is_deleted = false and roles.id::text = ${role_id}
            ORDER BY roles.name ASC;`;

        const accessNames = accesses.map((access) => access.access_name);

        return accessNames;
    } catch (error) {
        throw error;
    }
};

const updateRole = async (id, name) => {
    try {
        const updatedRole = await prisma.roles.update({
            where: {
                id: id
            },
            data: {
                name: name
            }
        });

        return updatedRole;
    } catch (error) {
        throw error;
    }
};

const deleteRoleById = async (id) => {
    try {
        await prisma.user_role.deleteMany({
            where: {
                role_id: id
            }
        });

        const deletedRole = await prisma.roles.update({
            where: {
                id: id
            },
            data: {
                is_deleted: true
            }
        });

        return deletedRole;
    } catch (error) {
        throw error;
    }
};

const undeleteRoleById = async (id) => {
    try {
        const deletedRole = await prisma.roles.update({
            where: {
                id: id
            },
            data: {
                is_deleted: false
            }
        });

        return deletedRole;
    } catch (error) {
        throw error;
    }
};

const getRoleOfUser = async (id) => {
    try {
        const roleIds = await prisma.user_role.findMany({
            where: {
                user_id: id
            }
        });

        return roleIds;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createRole,
    getRoleByName,
    getAllRoles,
    getRoleById,
    getAccessesOfARole,
    deleteRoleById,
    undeleteRoleById,
    assignRoleToUser,
    unAssignRoleFromUser,
    updateRole,
    getAssignedRolesToUser,
    getAccessNameOfARole,
    getRoleOfUser
};
