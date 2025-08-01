const Joi = require('joi');

const accessSchema = {
    createAccess: Joi.object().keys({
        access_name: Joi.string().required().messages({
            'string.pattern.base': 'Role Name must be a valid role name',
            'any.required': 'Role Name is required'
        }),
        access_path: Joi.string().required().messages({
            'string.pattern.base': 'Role Name must be a valid role name',
            'any.required': 'Role Name is required'
        }),
        access_method: Joi.string()
            .required()
            .valid('POST', 'GET', 'UPDATE', 'PATCH', 'PUT')
            .messages({
                'string.pattern.base': 'Role Name must be a valid role name',
                'any.required': 'Role Name is required'
            })
    }),

    getAccessById: Joi.object().keys({
        id: Joi.string()
            .required()
            .guid({
                version: ['uuidv4']
            })
            .messages({
                'string.pattern.base': 'Access Id must be a valid access id',
                'any.required': 'Access Id is required'
            })
    }),

    assignAccessToRole: Joi.object().keys({
        role_id: Joi.string()
            .required()
            .guid({
                version: ['uuidv4']
            })
            .messages({
                'string.pattern.base': 'Role Id must be a valid role id',
                'any.required': 'Role Id is required'
            }),
        access_ids: Joi.array()
            .items(Joi.string().guid({ version: 'uuidv4' }))
            .messages({
                'array.base': 'Courses IDs must be an array of valid UUID strings',
                'array.min': 'At least one course ID is required'
            })
    })
};

module.exports = accessSchema;
