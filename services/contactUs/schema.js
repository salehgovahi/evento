const Joi = require('joi');
const regexPattern = require('../../const/regex-patterns');

const contactUsSchema = {
    validateContact: Joi.object({
        category: Joi.string().required().messages({
            'string.required': 'انتخاب کردن دسته‌بندی الزامی است'
        }),
        title: Joi.string().required().messages({
            'string.required': 'وارد کردن عنوان الزامی است'
        }),
        email: Joi.string().required().email().messages({
            'string.required': 'وارد کردن ایمل الزامی است',
            'string.pattern.base': 'ایمل وارد شده معتبر نمی باشد'
        }),

        name: Joi.string().required().messages({
            'string.required': 'وارد کردن نام الزامی است'
        }),

        context: Joi.string()
    }),
    answeringContact: Joi.object().keys({
        answer: Joi.string().required().messages({
            'string.base': 'پاسخ باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن پاسخ الزامی است'
        }),
        send_email: Joi.boolean().required().messages({
            'boolean.base': 'ارسال یا عدم ارسال ایمیل باید یک مقدار بولی معتبر باشد',
            'any.required': 'وارد کردن ارسال یا عدم ارسال ایمیل الزامی است'
        })
    })
};
module.exports = contactUsSchema;
