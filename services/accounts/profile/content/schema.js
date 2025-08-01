const Joi = require('joi');

const gallerySchema = {
    updateAboutMe: Joi.object().keys({
        about: Joi.string().allow('').required().messages({
            'string.base': 'درباره من باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن درباره من الزامی است'
        })
    }),
    updateTitle: Joi.object().keys({
        title: Joi.string().allow('').required().messages({
            'string.base': 'عنوان باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن عنوان الزامی است'
        })
    })
};
module.exports = gallerySchema;
