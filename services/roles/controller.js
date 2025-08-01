const HttpError = require('../../utils/httpError');
const Errors = require('../../const/errors');
const roleController = require('./dbFunctions');
const userController = require('../users/dbFunctions');

// Create Role
const createRole = async (req, res, next) => {
    const { name } = req.body;

    try {
        // Check Role is Existing
        let existingRole = await roleController.getRoleByName(name);
        if (existingRole) {
            const error = new HttpError(Errors.Role_Is_Duplicate);
            return next(error);
        }

        // Create Role
        let createdRole = await roleController.createRole(name);

        res.status(201).json({
            status: 'success',
            result: createdRole
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

// Get All Existing Roles
const getAllRoles = async (req, res, next) => {
    try {
        // Get Roles and Check if Existing Any Role
        let allRoles = await roleController.getAllRoles();

        res.status(200).json({
            status: 'success',
            result: allRoles
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

// Get Role By ID
const getRoleById = async (req, res, next) => {
    const id = req.params.id;

    try {
        // Get Roles Check if Existing
        let foundedRole = await roleController.getRoleById(id);
        if (!foundedRole) {
            const error = new HttpError(Errors.Role_Undefined);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            result: foundedRole
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getAccessesOfARole = async (req, res, next) => {
    const id = req.params.id;

    try {
        // Get Roles Check if Existing
        let foundedRole = await roleController.getRoleById(id);
        if (!foundedRole) {
            const error = new HttpError(Errors.Role_Undefined);
            return next(error);
        }

        // Get Accesses of a Role
        let foundedAccesses = await roleController.getAccessesOfARole(id);

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

// Assign Role to User
const assignRoleToUser = async (req, res, next) => {
    const { role_ids, user_id } = req.body;

    try {
        // Check If a User With This User ID Is Existing
        let existingUser = await userController.getUserById(user_id);
        if (!existingUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        // Assign Role to User
        let assignedRole = await roleController.assignRoleToUser(user_id, role_ids);

        res.status(200).json({
            status: 'success',
            result: assignedRole
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const updateRole = async (req, res, next) => {
    const roleId = req.params.id;
    const { name } = req.body;

    try {
        // Check if Role is Existing
        let foundedRole = await roleController.getRoleById(roleId);
        if (!foundedRole) {
            const error = new HttpError(Errors.Role_Undefined);
            return next(error);
        }
        if (foundedRole.name == 'admin') {
            const error = new HttpError(Errors.Not_Delete_Admin_Role);
            return next(error);
        }

        // Updated Role
        let updatedRole = await roleController.updateRole(roleId, name);

        res.status(200).json({
            status: 'success',
            result: updatedRole
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

// Delete Role By ID
const deleteRoleById = async (req, res, next) => {
    const id = req.params.id;

    try {
        // Check if Role is Existing
        let foundedRole = await roleController.getRoleById(id);
        if (!foundedRole) {
            const error = new HttpError(Errors.Role_Undefined);
            return next(error);
        }
        if (foundedRole.name == 'admin') {
            const error = new HttpError(Errors.Not_Delete_Admin_Role);
            return next(error);
        }

        // Delete Role
        const deletedRole = await roleController.deleteRoleById(foundedRole.id);

        res.status(200).json({
            status: 'success',
            result: deletedRole
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const undeleteRoleById = async (req, res, next) => {
    const id = req.params.id;

    try {
        // Check if Role is Existing
        let foundedRole = await roleController.getRoleById(id);
        if (!foundedRole) {
            const error = new HttpError(Errors.Role_Undefined);
            return next(error);
        }

        // Delete Role
        const deletedRole = await roleController.undeleteRoleById(foundedRole.id);

        res.status(200).json({
            status: 'success',
            result: deletedRole
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    getAccessesOfARole,
    assignRoleToUser,
    updateRole,
    deleteRoleById,
    undeleteRoleById
};
