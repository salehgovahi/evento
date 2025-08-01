const Joi = require('joi');

const organizerSchema = {
    createOrganizer: Joi.object({
        name: Joi.string().required().messages({
            'string.pattern.base': 'نام برگزارکننده باید یک رشته باشد',
            'any.required': ' وارد کردن نام برگزارکننده الزامی است'
        })
    }),

    updateOrganizer: Joi.object({
        name: Joi.string().required().messages({
            'string.pattern.base': 'نام برگزارکننده باید یک رشته باشد',
            'any.required': ' وارد کردن نام برگزارکننده الزامی است'
        }),
        organizer_id: Joi.string()
            .required()
            .guid({
                version: ['uuidv4']
            })
            .messages({
                'string.pattern.base': 'شناسه برگزار کننده باید یک شناسه معتبر باشد',
                'any.required': 'وارد کردن شناسه برگزارکننده الزامی است'
            })
    }),

    validateOrganizerId: Joi.object({
        organizer_id: Joi.string()
            .required()
            .guid({
                version: ['uuidv4']
            })
            .messages({
                'string.pattern.base': 'شناسه برگزار کننده باید یک شناسه معتبر باشد',
                'any.required': 'وارد کردن شناسه برگزارکننده الزامی است'
            })
    })
};

module.exports = organizerSchema;
