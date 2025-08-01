const Joi = require('joi');

const socialNetworkSchema = {
    addSocialNetwork: Joi.object().keys({
        name: Joi.string().min(1).max(50).required().messages({
            'string.base': 'نام شبکه اجتماعی باید یک رشته معتبر باشد',
            'string.min': 'نام شبکه اجتماعی باید حداقل یک کاراکتر داشته باشد',
            'string.max': 'نام شبکه اجتماعی نمی‌تواند بیشتر از 50 کاراکتر باشد',
            'any.required': 'وارد کردن نام شبکه اجتماعی الزامی است'
        }),
        link: Joi.string().uri().required().messages({
            'string.base': 'لینک باید یک رشته معتبر باشد',
            'string.uri': 'لینک باید یک آدرس اینترنتی معتبر باشد',
            'any.required': 'وارد کردن لینک الزامی است'
        })
    })
};

module.exports = socialNetworkSchema;
