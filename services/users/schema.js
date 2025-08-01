const Joi = require('joi');
const { passwordPattern, phonePattern } = require('../../const/regex-patterns');

const userSchema = {
    createUser: Joi.object().keys({
        phone_number: Joi.string().regex(phonePattern).optional().messages({
            'string.pattern.base': 'شماره تلفن باید یک شماره تلفن معتبر باشد',
            'any.required': 'وارد کردن شماره تلفن الزامی است'
        }),
        name: Joi.string().optional().messages({
            'string.pattern.base': 'نام باید یک رشته معتبر باشد'
        }),
        family: Joi.string().optional().messages({
            'string.pattern.base': 'نام خانوادگی باید یک رشته معتبر باشد'
        }),
        birth_date: Joi.date().optional().messages({
            'string.pattern.base': 'تاریخ تولد باید یک تاریخ معتبر باشد'
        }),
        national_id: Joi.string().pattern(/^\d+$/).min(10).max(10).messages({
            'string.base': 'کدملی باید یک رشته باشد',
            'string.pattern.base': 'کدملی باید تنها شامل اعداد باشد',
            'string.min': 'کدملی نباید کمتر از 10 کاراکتر باشد',
            'string.max': 'کدملی نباید بیشتر از 10 کاراکتر باشد',
            'string.empty': 'وارد کردن کد ملی الزامی است'
        }),
        gender: Joi.string().valid('F', 'M').optional().messages({
            'string.pattern.base': 'جنسیت باید یک رشته معتبر باشد',
            'any.only': 'جنسیت باید مرد یا زن باشد'
        }),
        role_ids: Joi.array()
            .optional()
            .items(Joi.string().guid({ version: 'uuidv4' })) // Assuming course IDs are UUID v4 strings
            .messages({
                'array.base': 'Courses IDs must be an array of valid UUID strings',
                'array.min': 'At least one course ID is required'
            })
    }),

    validateUserId: Joi.object().keys({
        user_id: Joi.string()
            .required()
            .guid({
                version: ['uuidv4']
            })
            .messages({
                'string.pattern.base': 'User Id must be a valid user id',
                'any.required': 'User Id is required'
            })
    }),

    validateUpdateUserPut: Joi.object().keys({
        user_id: Joi.string()
            .required()
            .guid({
                version: ['uuidv4']
            })
            .messages({
                'string.pattern.base': 'User Id must be a valid user id',
                'any.required': 'User Id is required'
            }),
        phone_number: Joi.string().regex(phonePattern).optional().messages({
            'string.pattern.base': 'شماره تلفن باید یک شماره تلفن معتبر باشد',
            'any.required': 'وارد کردن شماره تلفن الزامی است'
        }),
        name: Joi.string().required().messages({
            'string.pattern.base': 'نام باید یک رشته معتبر باشد'
        }),
        family: Joi.string().required().messages({
            'string.pattern.base': 'نام خانوادگی باید یک رشته معتبر باشد'
        }),
        birth_date: Joi.date().required().messages({
            'string.pattern.base': 'تاریخ تولد باید یک تاریخ معتبر باشد'
        }),
        national_id: Joi.string().pattern(/^\d+$/).min(10).max(10).messages({
            'string.base': 'کدملی باید یک رشته باشد',
            'string.pattern.base': 'کدملی باید تنها شامل اعداد باشد',
            'string.min': 'کدملی نباید کمتر از 10 کاراکتر باشد',
            'string.max': 'کدملی نباید بیشتر از 10 کاراکتر باشد',
            'string.empty': 'وارد کردن کد ملی الزامی است'
        }),
        gender: Joi.string().valid('F', 'M').required().messages({
            'string.pattern.base': 'جنسیت باید یک رشته معتبر باشد',
            'any.only': 'جنسیت باید مرد یا زن باشد'
        }),
        role_ids: Joi.array()
            .required()
            .items(Joi.string().guid({ version: 'uuidv4' })) // Assuming course IDs are UUID v4 strings
            .messages({
                'array.base': 'Courses IDs must be an array of valid UUID strings',
                'array.min': 'At least one course ID is required'
            })
    }),
    validateUpdateUserPatch: Joi.object().keys({
        phone_number: Joi.string().regex(phonePattern).optional().messages({
            'string.pattern.base': 'شماره تلفن باید یک شماره تلفن معتبر باشد'
        }),
        name: Joi.string().optional().messages({
            'string.pattern.base': 'نام باید یک رشته معتبر باشد'
        }),
        family: Joi.string().optional().messages({
            'string.pattern.base': 'نام خانوادگی باید یک رشته معتبر باشد'
        }),
        birth_date: Joi.date().optional().messages({
            'string.pattern.base': 'تاریخ تولد باید یک تاریخ معتبر باشد'
        }),
        national_id: Joi.string().pattern(/^\d+$/).min(10).max(10).messages({
            'string.base': 'کدملی باید یک رشته باشد',
            'string.pattern.base': 'کدملی باید تنها شامل اعداد باشد',
            'string.min': 'کدملی نباید کمتر از 10 کاراکتر باشد',
            'string.max': 'کدملی نباید بیشتر از 10 کاراکتر باشد',
            'string.empty': 'وارد کردن کد ملی الزامی است'
        }),
        gender: Joi.string().valid('F', 'M').optional().messages({
            'string.pattern.base': 'جنسیت باید یک رشته معتبر باشد',
            'any.only': 'جنسیت باید مرد یا زن باشد'
        }),
        role_ids: Joi.array()
            .optional()
            .items(Joi.string().guid({ version: 'uuidv4' })) // Assuming course IDs are UUID v4 strings
            .messages({
                'array.base': 'Courses IDs must be an array of valid UUID strings',
                'array.min': 'At least one course ID is required'
            })
    }),
    validateUpdatePhoneNumber: Joi.object().keys({
        phone_number: Joi.string().regex(phonePattern).required().messages({
            'string.pattern.base': 'شماره تلفن باید یک شماره تلفن معتبر باشد',
            'any.required': 'وارد کردن شماره تلفن الزامی است'
        })
    })
};

module.exports = userSchema;
