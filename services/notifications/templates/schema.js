const Joi = require('joi');

const templateSchema = {
    addTemplate: Joi.object().keys({
        code: Joi.string().required().messages({
            'string.base': 'کد باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن کد الزامی است'
        }),
        title: Joi.string().required().messages({
            'string.base': 'عنوان باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن عنوان الزامی است'
        }),
        body: Joi.string().required().messages({
            'string.base': 'متن باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن متن الزامی است'
        })
    }),
    updateTemplate: Joi.object().keys({
        code: Joi.string().optional().messages({
            'string.base': 'کد باید یک رشته معتبر باشد'
        }),
        title: Joi.string().optional().messages({
            'string.base': 'عنوان باید یک رشته معتبر باشد'
        }),
        body: Joi.string().optional().messages({
            'string.base': 'متن باید یک رشته معتبر باشد'
        })
    })
};
module.exports = templateSchema;
