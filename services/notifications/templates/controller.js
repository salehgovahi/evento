const HttpError = require('../../../utils/httpError');
const Errors = require('../../../const/errors');
const dbFunctions = require('./dbFunctions');

// Add a template
const addTemplate = async (req, res, next) => {
    const { code, title, body } = req.body;
    const user_id = req.user_id;

    try {
        const existingTemplate = await dbFunctions.getTemplateByCode(code);
        if (existingTemplate) {
            const error = new HttpError(Errors.Template_Exists);
            return next(error);
        }

        const addedTemplate = await dbFunctions.addTemplate(code, title, body, user_id);

        res.status(200).json({
            status: 'success',
            result: addedTemplate
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

// Get all templates
const getAllTemplates = async (req, res, next) => {
    try {
        const allTemplates = await dbFunctions.getAllTemplates();

        res.status(200).json({
            status: 'success',
            result: allTemplates
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

// Get template by id
const getTemplateById = async (req, res, next) => {
    const template_id = req.params.template_id;
    try {
        const foundedTemplate = await dbFunctions.getTemplateById(template_id);
        if (!foundedTemplate) {
            const error = new HttpError(Errors.Template_Undefined);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            result: foundedTemplate
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const updateTemplateById = async (req, res, next) => {
    const template_id = req.params.template_id;
    const { title, body } = req.body;
    try {
        const foundedTemplate = await dbFunctions.getTemplateById(template_id);
        if (!foundedTemplate) {
            const error = new HttpError(Errors.Template_Undefined);
            return next(error);
        }

        const updateData = {
            title: title ?? foundedTemplate.title,
            body: body ?? foundedTemplate.body
        };

        const updatedTemplate = await dbFunctions.updateTemplateById(template_id, updateData);

        res.status(200).json({
            status: 'success',
            result: updatedTemplate
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const deleteTemplateById = async (req, res, next) => {
    const template_id = req.params.template_id;

    try {
        const foundedTemplate = await dbFunctions.getTemplateById(template_id);
        if (!foundedTemplate) {
            const error = new HttpError(Errors.Template_Undefined);
            return next(error);
        }

        const deletedTemplate = await dbFunctions.deleteTemplateById(template_id);

        res.status(200).json({
            status: 'success',
            result: deletedTemplate
        }); 
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const undeleteTemplateById = async (req, res, next) => {
    const template_id = req.params.template_id;
    try {
        const foundedTemplate = await dbFunctions.getTemplateById(template_id);
        if (!foundedTemplate) {
            const error = new HttpError(Errors.Template_Undefined);
            return next(error);
        }

        const undeletedTemplate = await dbFunctions.undeleteTemplateById(template_id);

        res.status(200).json({
            status: 'success',
            result: undeletedTemplate
        }); 
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};
module.exports = {
    addTemplate,
    getAllTemplates,
    getTemplateById,
    updateTemplateById,
    deleteTemplateById, 
    undeleteTemplateById
};
