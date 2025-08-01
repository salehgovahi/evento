const Joi = require('joi');
const { emailPattern } = require('../../../../const/regex-patterns');

const userSchema = {
    putRequest: Joi.object().keys({
        name: Joi.string().required().messages({
            'string.pattern.base': 'نام باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن نام الزامی است'
        }),
        family: Joi.string().required().messages({
            'string.pattern.base': 'نام خانوادگی باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن نام خانوادگی الزامی است'
        }),
        birth_date: Joi.date().required().messages({
            'string.pattern.base': 'تاریخ تولد باید یک تاریخ معتبر باشد',
            'any.required': 'وارد کردن تاریخ تولد الزامی است'
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
            'any.only': 'جنسیت باید مرد یا زن باشد',
            'any.required': 'وارد کردن جنسیت الزامی است'
        }),
        province: Joi.string().required().messages({
            'string.pattern.base': 'استان محل سکونت باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن استان محل سکونت الزامی است'
        }),
        city: Joi.string().required().messages({
            'string.pattern.base': 'شهر محل سکونت باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن شهر محل سکونت الزامی است'
        }),
        // email: Joi.string().regex(emailPattern).required().messages({
        //     'string.pattern.base': 'ایمیل باید یک ایمیل معتبر باشد',
        // }),
        nationality: Joi.string().required().messages({
            'string.pattern.base': 'ملیت باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن ملیت الزامی است'
        }),
        passport_number: Joi.string().required().messages({
            'string.pattern.base': 'شماره پاسپورت باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن شماره پاسپورت الزامی است'
        })
    }),
    patchRequest: Joi.object().keys({
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
    })
};

module.exports = userSchema;
