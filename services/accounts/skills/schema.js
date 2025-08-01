const Joi = require('joi');

const skillsSchema = {
    addAndUpdateSkill: Joi.object().keys({
        name: Joi.string().allow('').required().messages({
            'string.base': 'عنوان مهارت باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن عنوان مهارت الزامی است'
        })
    })
};
module.exports = skillsSchema;
