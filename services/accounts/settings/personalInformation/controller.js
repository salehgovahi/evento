const fs = require('fs');

const HttpError = require('../../../../utils/httpError');
const Errors = require('../../../../const/errors');
const dbFunctions = require('./dbFunctions');
const userDbFunctions = require('../../../users/dbFunctions');
const { sendRequest } = require('../../../../utils/sendRequest');
const environments = require('../../../../configs/environments');
const staticVariables = require('../../../../const/staticVariables');

const getInformation = async (req, res, next) => {
    const user_id = req.user_id;

    try {
        const existingUser = await userDbFunctions.getUserById(user_id);
        if (!existingUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        const userInfo = await dbFunctions.getInformation(user_id);

        res.status(200).json({
            status: 'success',
            result: userInfo
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getProvinces = async (req, res, next) => {
    try {
        const provinces = await dbFunctions.getProvinces();

        res.status(200).json({
            status: 'success',
            result: provinces
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getUniversityLevels = async (req, res, next) => {
    try {
        const universityLevels = await dbFunctions.getUniversityLevel();

        res.status(200).json({
            status: 'success',
            result: universityLevels
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getSchoolLevels = async (req, res, next) => {
    try {
        const schoolLevels = await dbFunctions.getSchoolLevels();

        res.status(200).json({
            status: 'success',
            result: schoolLevels
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getSchoolStudyFields = async (req, res, next) => {
    try {
        const schoolStudyFields = await dbFunctions.getSchoolStudyFields();

        res.status(200).json({
            status: 'success',
            result: schoolStudyFields
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getUniversityStudyFields = async (req, res, next) => {
    try {
        const universityStudyFields = await dbFunctions.getUniversityStudyFields();

        res.status(200).json({
            status: 'success',
            result: universityStudyFields
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getMilitaryStatus = async (req, res, next) => {
    try {
        const militaryStatus = await dbFunctions.getMilitaryStatus();

        res.status(200).json({
            status: 'success',
            result: militaryStatus
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getFamiliarityWays = async (req, res, next) => {
    try {
        const familiarityWays = await dbFunctions.getFamiliarityWays();

        res.status(200).json({
            status: 'success',
            result: familiarityWays
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getRelatedInformationTogether = async (req, res, next) => {
    try {
        let result = {};
        result['school_levels'] = await dbFunctions.getSchoolLevels();
        result['university_levels'] = await dbFunctions.getUniversityLevel();
        result['school_fields'] = await dbFunctions.getSchoolStudyFields();
        result['university_fields'] = await dbFunctions.getUniversityStudyFields();
        result['military_status'] = await dbFunctions.getMilitaryStatus();
        result['familiarity_ways'] = await dbFunctions.getFamiliarityWays();

        res.status(200).json({
            status: 'success',
            result: result
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getCitiesOfAProvince = async (req, res, next) => {
    const province_id = req.params.province_id;

    try {
        const cities = await dbFunctions.getCitiesOfAProvince(province_id);

        res.status(200).json({
            status: 'success',
            result: cities
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const uploadImage = async (req, res, next) => {
    const user_id = req.user_id;
    const imageFile = req.file;

    try {
        const existingUser = await userDbFunctions.getUserById(user_id);
        if (!existingUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        if (imageFile.size > staticVariables.MAX_IMAGE_SIZE) {
            fs.unlinkSync(imageFile.path);
            const error = new HttpError(Errors.Image_Max_Size);
            return next(error);
        }

        const sendFileToFileServer = await sendRequest(
            environments.FILE_SERVER_SEND_IMAGE_URL,
            imageFile.path
        );

        const updatedUser = await dbFunctions.uploadImage(user_id, sendFileToFileServer.image_url);

        if (!updatedUser) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            result: updatedUser
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const deleteImage = async (req, res, next) => {
    const user_id = req.user_id;

    try {
        const existingUser = await userDbFunctions.getUserById(user_id);
        if (!existingUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        const updatedUser = await dbFunctions.deleteImage(user_id);

        if (!updatedUser) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            result: updatedUser
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const uploadCV = async (req, res, next) => {
    const user_id = req.user_id;
    const cvFile = req.file;

    try {
        const existingUser = await userDbFunctions.getUserById(user_id);
        if (!existingUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        if (cvFile.size > staticVariables.MAX_PDF_SIZE) {
            fs.unlinkSync(cvFile.path);
            const error = new HttpError(Errors.Document_Max_Size);
            return next(error);
        }

        const sendFileToFileServer = await sendRequest(
            environments.FILE_SERVER_SEND_DOCUMENT_URL,
            cvFile.path
        );

        const uploadedCV = await dbFunctions.uploadCV(user_id, sendFileToFileServer.document_url);

        if (!uploadedCV) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            result: uploadedCV
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const uploadMotivationLetter = async (req, res, next) => {
    const user_id = req.user_id;
    const motivationFile = req.file;

    try {
        const existingUser = await userDbFunctions.getUserById(user_id);
        if (!existingUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        const sendFileToFileServer = await sendRequest(
            environments.FILE_SERVER_SEND_DOCUMENT_URL,
            motivationFile.path
        );

        const uploadedMotivationFile = await dbFunctions.uploadMotivationLetter(
            user_id,
            sendFileToFileServer.document_url
        );

        if (!uploadedMotivationFile) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            result: uploadedMotivationFile
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const updateInformationInPut = async (req, res, next) => {
    const user_id = req.user_id;
    const {
        name,
        family,
        birth_date,
        national_id,
        gender,
        province,
        city,
        // email         ,
        nationality,
        passport_number,
        about_me,
        educational_status,
        institution_name,
        educational_level,
        field_of_study,
        employment_status,
        job_title,
        military_status,
        familiarity_way,
        linkedin_address
    } = req.body;

    try {
        const existingUser = await userDbFunctions.getUserById(user_id);
        if (!existingUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        if (national_id) {
            let isValidNationalId = isValidNationalCode(national_id);
            if (!isValidNationalId) {
                const error = new HttpError(Errors.National_Id_Not_Valid);
                return next(error);
            }
        }

        const updatedInformation = await dbFunctions.updateInformation(
            user_id,
            name,
            family,
            birth_date,
            national_id,
            gender,
            province,
            city,
            // email         ,
            nationality,
            passport_number,
            about_me,
            educational_status,
            institution_name,
            educational_level,
            field_of_study,
            employment_status,
            job_title,
            military_status,
            familiarity_way,
            linkedin_address
        );

        if (!updatedUser) {
            const error = new HttpError(Errors.Something_Went_Wrong);
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            result: updatedInformation
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const updateInformationInPatch = async (req, res, next) => {
    const user_id = req.user_id;
    const {
        name,
        family,
        birth_date,
        national_id,
        gender,
        province,
        city,
        // email         ,
        nationality,
        passport_number,
        about_me,
        educational_status,
        institution_name,
        educational_level,
        field_of_study,
        employment_status,
        job_title,
        military_status,
        familiarity_way,
        linkedin_address
    } = req.body;

    try {
        const existingUser = await userDbFunctions.getUserById(user_id);
        if (!existingUser) {
            const error = new HttpError(Errors.User_Undefined);
            return next(error);
        }

        const userInfo = await dbFunctions.getInformation(user_id);

        if (national_id) {
            let isValidNationalId = isValidNationalCode(national_id);
            if (!isValidNationalId) {
                const error = new HttpError(Errors.National_Id_Not_Valid);
                return next(error);
            }
        }

        let profileInfo = {
            name: name || userInfo.name,
            family: family || userInfo.family,
            birth_date: birth_date || userInfo.birth_date,
            national_id: national_id || userInfo.national_id,
            gender: gender || userInfo.gender,
            province: province || userInfo.province,
            city: city || userInfo.city,
            nationality: nationality || userInfo.nationality,
            passport_number: passport_number || userInfo.passport_number,
            about_me: about_me || userInfo.about_me,
            educational_status: educational_status || userInfo.educational_status,
            institution_name: institution_name || userInfo.institution_name,
            educational_level: educational_level || userInfo.educational_level,
            field_of_study: field_of_study || field_of_study,
            employment_status: employment_status || userInfo.employment_status,
            job_title: job_title || userInfo.job_title,
            military_status: military_status || userInfo.military_status,
            familiarity_way: familiarity_way || userInfo.familiarity_way,
            linkedin_address: linkedin_address || userInfo.linkedin_address
        };
        const updatedInformation = await dbFunctions.updateInformation(user_id, profileInfo);

        res.status(200).json({
            status: 'success',
            result: updatedInformation
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

function isValidNationalCode(nationalId) {
    if (/^\d{10}$/.test(nationalId)) {
        const firstNumber = parseInt(nationalId[0]);
        let counter = 0;
        let totalSum = 0;

        for (let i = 1; i < 10; i++) {
            const num = parseInt(nationalId[i - 1]);

            if (num === firstNumber) {
                counter++;
            }
            totalSum += num * (11 - i);
        }

        let r = totalSum % 11;

        if (r > 1) {
            r = 11 - r;
        }

        if (r === parseInt(nationalId[9]) && counter < 9) {
            return true;
        }
    }

    return false;
}

module.exports = {
    getInformation,
    getProvinces,
    getCitiesOfAProvince,
    getUniversityLevels,
    getSchoolLevels,
    getSchoolStudyFields,
    getUniversityStudyFields,
    getMilitaryStatus,
    getFamiliarityWays,
    getRelatedInformationTogether,
    uploadImage,
    deleteImage,
    uploadCV,
    uploadMotivationLetter,
    updateInformationInPut,
    updateInformationInPatch
};
