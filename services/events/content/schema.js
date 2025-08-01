const Joi = require('joi');
const { link } = require('pdfkit');

const eventContent = {
    addEvent: Joi.object().keys({
        title: Joi.string().required().messages({
            'string.base': 'عنوان باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن عنوان الزامی است'
        }),
        type: Joi.string().required().messages({
            'string.base': 'عنوان باید یک رشته معتبر باشد',
            'any.required': 'وارد کردن عنوان الزامی است'
        })
    }),

    updateEvent: Joi.object().keys({
        title: Joi.string().optional().messages({
            'string.base': 'عنوان باید یک رشته معتبر باشد'
        }),
        introduction: Joi.string().optional().messages({
            'string.base': 'معرفی باید یک رشته معتبر باشد'
        }),
        description: Joi.string().optional().messages({
            'string.base': 'توضیحات باید یک رشته معتبر باشد'
        }),
        start_registration: Joi.date().optional().messages({
            'date.base': 'تاریخ شروع ثبت نام باید یک تاریخ معتبر باشد'
        }),
        end_registration: Joi.date().optional().messages({
            'date.base': 'تاریخ پایان ثبت نام باید یک تاریخ معتبر باشد'
        }),
        start_time: Joi.date().optional().messages({
            'date.base': 'تاریخ شروع باید یک تاریخ معتبر باشد'
        }),
        end_time: Joi.date().optional().messages({
            'date.base': 'تاریخ پایان باید یک تاریخ معتبر باشد'
        }),
        latitude: Joi.number().strict().optional().messages({
            'number.base': 'عرض جغرافیایی باید یک عدد معتبر باشد'
        }),
        longitude: Joi.number().strict().optional().messages({
            'number.base': 'طول جغرافیایی باید یک عدد معتبر باشد'
        }),
        organizer: Joi.string().optional().messages({
            'string.base': 'برگزارکننده باید یک برگزار کننده معتبر باشد'
        }),
        capacity: Joi.number().optional().messages({
            'string.base': 'ظرفیت باید یک عدد معتبر باشد'
        }),
        link: Joi.string().optional().messages({
            'string.base': 'لینک باید یک رشته معتبر باشد' 
        }),
    })
};

module.exports = eventContent;
