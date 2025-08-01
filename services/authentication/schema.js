const Joi = require('joi');
const { passwordPattern, phonePattern, emailPattern } = require('../../const/regex-patterns');

const authSchema = {
    sendCode: Joi.object().keys({
        email: Joi.string().regex(emailPattern).required().messages({
            'string.pattern.base': 'شماره تلفن باید یک شماره تلفن معتبر باشد',
            'any.required': 'وارد کردن شماره تلفن الزامی است'
        }),
        ip: Joi.string().required().messages({
            'string.pattern.base': 'IP must be a valid title',
            'any.required': 'IP is required'
        })
    }),

    signup_confirm: Joi.object().keys({
        email: Joi.string().regex(emailPattern).required().messages({
            'string.pattern.base': 'شماره تلفن باید یک شماره تلفن معتبر باشد',
            'any.required': 'وارد کردن شماره تلفن الزامی است'
        }),
        verification_code: Joi.number().required().messages({
            'string.pattern.base': 'کد تایید باید یک عدد ۵ رقمی باشد',
            'any.required': 'وارد کردن کد تایید الزامی است'
        })
    }),

    login: Joi.object().keys({
        phone_number: Joi.string().regex(phonePattern).required().messages({
            'string.pattern.base': 'شماره تلفن باید یک شماره تلفن معتبر باشد',
            'any.required': 'وارد کردن شماره تلفن الزامی است'
        }),
        password: Joi.string().regex(passwordPattern).required().messages({
            'string.pattern.base': 'رمز عبور باید شرایط رمز عبور را داشته باشد',
            'any.required': 'وارد کردن رمز عبور الزامی است'
        })
    }),

    forgetPassword: Joi.object().keys({
        phone_number: Joi.string().regex(phonePattern).required().messages({
            'string.pattern.base': 'شماره تلفن باید یک شماره تلفن معتبر باشد',
            'any.required': 'وارد کردن شماره تلفن الزامی است'
        })
    }),

    confirmForgetPassword: Joi.object().keys({
        phone_number: Joi.string().regex(phonePattern).required().messages({
            'string.pattern.base': 'شماره تلفن باید یک شماره تلفن معتبر باشد',
            'any.required': 'وارد کردن شماره تلفن الزامی است'
        }),
        verification_code: Joi.number().required().messages({
            'string.pattern.base': 'کد تایید باید یک عدد ۴ رقمی باشد',
            'any.required': 'وارد کردن کد تایید الزامی است'
        })
    }),

    changePassword: Joi.object().keys({
        phone_number: Joi.string().regex(phonePattern).required().messages({
            'string.pattern.base': 'شماره تلفن باید یک شماره تلفن معتبر باشد',
            'any.required': 'وارد کردن شماره تلفن الزامی است'
        }),
        password: Joi.string().regex(passwordPattern).required().messages({
            'string.pattern.base': 'رمز عبور باید شرایط رمز عبور را داشته باشد',
            'any.required': 'وارد کردن رمز عبور الزامی است'
        }),
        password: Joi.string().regex(passwordPattern).required().messages({
            'string.pattern.base': 'رمز عبور باید شرایط رمز عبور را داشته باشد',
            'any.required': 'وارد کردن رمز عبور الزامی است'
        })
    })
};

module.exports = authSchema;
