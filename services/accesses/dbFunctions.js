const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Gives All Existing Accesses
const getAllAccesses = async () => {
    try {
        const foundedAccesses = await prisma.accesses.findMany({});
        return foundedAccesses;
    } catch (error) {
        throw error;
    }
};

// Gives an access By Name
const getAccessByName = async (access_name) => {
    try {
        const foundedAccess = await prisma.accesses.findUnique({
            where: {
                name: access_name
            }
        });
        return foundedAccess;
    } catch (error) {
        throw error;
    }
};

// Get An Access By Id
const getAccessById = async (access_id) => {
    try {
        const foundedAccess = await prisma.accesses.findUnique({
            where: {
                id: access_id
            }
        });
        return foundedAccess;
    } catch (error) {
        throw error;
    }
};

// Get Assigned Access to a Role
const getAssignedAccessByID = async (access_id, role_id) => {
    try {
        const foundedAccess = await prisma.role_access.findFirst({
            where: {
                access_id: access_id,
                role_id: role_id
            }
        });
        return foundedAccess;
    } catch (error) {
        throw error;
    }
};

const assignAccess = async (role_id, access_ids) => {
    try {
        // Collect All Accesses of a Role Id In An Array
        const existingAccesses = await prisma.role_access.findMany({
            where: {
                role_id: role_id
            }
        });
        let existingAccessIDs = existingAccesses.map((access) => access.access_id);

        // Assign Access if Not Exists In Role Accesses
        for (let entered_access of access_ids) {
            // Check if Entered Access is Not Exists in Role's Accesses
            if (!existingAccessIDs.includes(entered_access)) {
                // Assign Access
                await prisma.role_access.create({
                    data: {
                        role_id: role_id,
                        access_id: entered_access
                    }
                });
            }
            // Remove Entered Access from Arrays of Existing Accesses
            existingAccessIDs = existingAccessIDs.filter((item) => item !== entered_access);
        }

        // Delete All Remaining Accesses in Arrays of Accesses
        for (let remainingAccess of existingAccessIDs) {
            await prisma.role_access.deleteMany({
                where: {
                    role_id: role_id,
                    access_id: remainingAccess
                }
            });
        }

        // Returns Updated Accesses
        const updatedAccesses = await prisma.role_access.findMany({
            where: {
                role_id: role_id
            }
        });
        return updatedAccesses;
    } catch (error) {
        throw error;
    }
};

// Delete an Access By its Id
const deleteAccessById = async (access_id) => {
    try {
        // Delete all assigned accesses from roles
        await prisma.role_access.deleteMany({
            where: {
                access_id: access_id
            }
        });

        // Change is_deleted Parameters to True and Return Updated Access
        const deletedAccess = await prisma.accesses.update({
            where: {
                id: access_id
            },
            data: {
                is_deleted: true
            }
        });
        return deletedAccess;
    } catch (error) {
        throw error;
    }
};

// UnDelete an Access By its Id
const unDeleteAccessById = async (access_id) => {
    try {
        // Change is_deleted Parameters to False and Return Updated Access
        const UnDeletedAccess = await prisma.accesses.update({
            where: {
                id: access_id
            },
            data: {
                is_deleted: false
            }
        });
        return UnDeletedAccess;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllAccesses,
    getAccessByName,
    getAccessById,
    getAssignedAccessByID,
    assignAccess,
    deleteAccessById,
    unDeleteAccessById
};
