const Joi = require('joi');
const { phonePattern } = require('../../../const/regex-patterns');

const registration = {
    registerSchema: Joi.object().keys({
        phone_number: Joi.string().regex(phonePattern).required().messages({
            'string.pattern.base': 'شماره تلفن باید یک شماره تلفن معتبر باشد',
            'any.required': 'وارد کردن شماره تلفن الزامی است'
        }),
        name: Joi.string().required().messages({
            'string.base': 'نام باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن نام الزامی است'
        }),
        family: Joi.string().required().messages({
            'string.base': 'نام خانوادگی باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن نام خانوادگی الزامی است'
        }),
        birth_date: Joi.date().required().messages({
            'date.base': 'تاریخ تولد باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن تاریخ تولد الزامی است'
        }),
        national_id: Joi.string().required().messages({
            'string.base': 'شماره ملی باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن شماره ملی الزامی است'
        }),
        gender: Joi.string().valid('F', 'M').required().messages({
            'string.pattern.base': 'جنسیت باید یک رشته معتبر باشد',
            'any.only': 'جنسیت باید مرد یا زن باشد',
            'any.required': 'وارد کردن جنسیت الزامی است'
        })
    }),
    updateRegistrationSchema: Joi.object().keys({
        phone_number: Joi.string().regex(phonePattern).optional().messages({
            'string.pattern.base': 'شماره تلفن باید یک شماره تلفن معتبر باشد'
        }),
        name: Joi.string().optional().messages({
            'string.base': 'نام باید یک رشته معتبر باشد'
        }),
        family: Joi.string().optional().messages({
            'string.base': 'نام خانوادگی باید یک رشته معتبر باشد'
        }),
        birth_date: Joi.date().optional().messages({
            'date.base': 'تاریخ تولد باید یک رشته معتبر باشد'
        }),
        national_id: Joi.string().optional().messages({
            'string.base': 'شماره ملی باید یک رشته معتبر باشد'
        }),
        city: Joi.string().optional().messages({
            'string.base': 'شهر باید یک رشته معتبر باشد'
        }),
        educational_status: Joi.string().optional().messages({
            'string.base': 'وضعیت تحصیلی باید یک رشته معتبر باشد'
        }),
        passport_number: Joi.string().optional().messages({
            'string.base': 'شماره گذرنامه باید یک رشته معتبر باشد'
        }),
        nationality: Joi.string().optional().messages({
            'string.base': 'ملیت باید یک رشته معتبر باشد'
        }),
        educational_level: Joi.number().integer().optional().messages({
            'number.base': 'سطح تحصیلی باید یک عدد معتبر باشد',
            'number.integer': 'سطح تحصیلی باید یک عدد صحیح باشد'
        }),
        field_of_study: Joi.number().integer().optional().messages({
            'number.base': 'رشته تحصیلی باید یک عدد معتبر باشد',
            'number.integer': 'رشته تحصیلی باید یک عدد صحیح باشد'
        }),
        institution_name: Joi.string().optional().messages({
            'string.base': 'نام مؤسسه باید یک رشته معتبر باشد'
        }),
        gmail: Joi.string().email().optional().messages({
            'string.base': 'ایمیل باید یک رشته معتبر باشد',
            'string.email': 'ایمیل باید یک آدرس ایمیل معتبر باشد'
        })
    })
};

module.exports = registration;
