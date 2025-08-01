const express = require('express');
const router = express.Router();
const profileController = require('./controller');
const validator = require('../../../../middlewares/joi-validator');
const profileSchema = require('./schema');
// const { processFile } = require('../../middlewares/uploadFile');
const { upload } = require('../../../../middlewares/uploadFile');

const { checkToken } = require('../../../../middlewares/jwtCheck');

router.get('/get-info', checkToken, profileController.getInformation);

router.get('/get-provinces', profileController.getProvinces);

router.get('/get-university-levels', profileController.getUniversityLevels);

router.get('/get-school-levels', profileController.getSchoolLevels);

router.get('/get-school-fields', profileController.getSchoolStudyFields);

router.get('/get-university-fields', profileController.getUniversityStudyFields);

router.get('/get-military-status', profileController.getMilitaryStatus);

router.get('/get-familiarity-way', profileController.getFamiliarityWays);

router.get('/get-related-info', profileController.getRelatedInformationTogether);

router.get('/get-cities/:province_id', profileController.getCitiesOfAProvince);

router.post('/upload-image', [upload.single('file'), checkToken], profileController.uploadImage);

router.put('/delete-image', checkToken, profileController.deleteImage);

router.post('/upload-cv', [upload.single('file'), checkToken], profileController.uploadCV);

router.post(
    '/upload-motivation-letter/',
    [upload.single('file'), checkToken],
    profileController.uploadMotivationLetter
);

router.put(
    '/update-info',
    [validator(profileSchema.putRequest, 'body'), checkToken],
    profileController.updateInformationInPut
);

router.patch(
    '/update-info',
    [validator(profileSchema.patchRequest, 'body'), checkToken],
    profileController.updateInformationInPatch
);

module.exports = router;
