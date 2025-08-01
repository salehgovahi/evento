const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const HttpError = require('../../utils/httpError');
const Errors = require('../../const/errors');
const accessController = require('./dbFunctions');
const roleController = require('../roles/dbFunctions');

// Assign Access to Role
const assignAccessToRole = async (req, res, next) => {
    const { role_id, access_ids } = req.body;

    try {
        // Check That This Assignment Not Existing
        const existingRole = await roleController.getRoleById(role_id);
        if (!existingRole) {
            const error = new HttpError(Errors.Role_Undefined);
            return next(error);
        }

        // Assign Access
        const assignedAccess = await accessController.assignAccess(role_id, access_ids);
        if (!assignedAccess) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }

        // Return Assigned Accesses to a Role
        res.status(20).json({
            status: 'success',
            result: assignedAccess
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

// Get All Existing Accesses
const getAllAccesses = async (req, res, next) => {
    try {
        // Return All Existing Accesses
        const foundedAccesses = await accessController.getAllAccesses();
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

// Get Existing Accesses By ID
const getAccessById = async (req, res, next) => {
    const accessId = req.params.id;

    try {
        // Check If Any Access Existing With This Access ID and Returns If Exists
        const foundedAccess = await accessController.getAccessById(accessId);
        if (!foundedAccess) {
            const error = new HttpError(Errors.Access_Unfounded);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            result: foundedAccess
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

// Delete Access By Id
const deleteAccessById = async (req, res, next) => {
    const accessId = req.params.id;

    try {
        // Check If Any Access Existing With This Access ID
        const foundedAccess = await accessController.getAccessById(accessId);
        if (!foundedAccess) {
            const error = new HttpError(Errors.Access_Unfounded);
            return next(error);
        }

        // Delete Access and Return Deleted Access
        const deletedAccess = await accessController.deleteAccessById(accessId);
        res.status(200).json({
            status: 'success',
            result: deletedAccess
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

// UnDelete Access By Id
const unDeleteAccessById = async (req, res, next) => {
    const accessId = req.params.id;

    try {
        // Check If Any Access Existing With This Access ID
        const foundedAccess = await accessController.getAccessById(accessId);
        if (!foundedAccess) {
            const error = new HttpError(Errors.Access_Unfounded);
            return next(error);
        }

        // UnDelete Access and Return Deleted Access
        const UnDeletedAccess = await accessController.unDeleteAccessById(accessId);
        res.status(200).json({
            status: 'success',
            result: UnDeletedAccess
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    assignAccessToRole,
    getAllAccesses,
    getAccessById,
    deleteAccessById,
    unDeleteAccessById
};
