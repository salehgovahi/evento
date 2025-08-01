const Joi = require('joi');

const roleSchema = {
    validateRoleName: Joi.object().keys({
        name: Joi.string().required().messages({
            'string.pattern.base': 'Role Name must be a valid role name',
            'any.required': 'Role Name is required'
        })
    }),

    validateRoleId: Joi.object().keys({
        id: Joi.string()
            .required()
            .guid({
                version: ['uuidv4']
            })
            .messages({
                'string.pattern.base': 'Role Id must be a valid role id',
                'any.required': 'Role Id is required'
            })
    })
};

module.exports = roleSchema;
