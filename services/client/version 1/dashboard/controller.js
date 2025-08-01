// const HttpError = require('../../../../utils/httpError');
// const Errors = require('../../../../const/errors');
// const dbFunctions = require('./dbFunctions');
// const courseActivitiesDbFunctions = require('../../../courses/activities/dbFunctions');

// const getMyCourses = async (req, res, next) => {
//     const user_id = req.user_id;

//     try {
//         const myCourse = await dbFunctions.getMyCourses(user_id);

//         let progressPercentage;
//         for (let course of myCourse) {
//             progressPercentage = await courseActivitiesDbFunctions.getProgressPercentageOfACourse(
//                 course.id,
//                 user_id
//             );
//             course['progress_percentage'] = progressPercentage;
//         }

//         res.status(200).json({
//             status: 'success',
//             result: myCourse
//         });
//     } catch (err) {
//         console.log(err);
//         const error = new HttpError(Errors.Something_Went_Wrong);
//         return next(error);
//     }
// };

// const getMyCertificates = async (req, res, next) => {
//     const user_id = req.user_id;

//     try {
//         const myCertificates = await dbFunctions.getMyCertificates(user_id);

//         res.status(200).json({
//             status: 'success',
//             result: myCertificates
//         });
//     } catch (err) {
//         console.log(err);
//         const error = new HttpError(Errors.Something_Went_Wrong);
//         return next(error);
//     }
// };

// const getMyQuestions = async (req, res, next) => {
//     const user_id = req.user_id;

//     try {
//         const myQuestions = await dbFunctions.getMyQuestions(user_id);

//         res.status(200).json({
//             status: 'success',
//             result: myQuestions
//         });
//     } catch (err) {
//         console.log(err);
//         const error = new HttpError(Errors.Something_Went_Wrong);
//         return next(error);
//     }
// };

// const getMyBootCamps = async (req, res, next) => {
//     const user_id = req.user_id;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     try {
//         const getAllBootCamps = await dbFunctions.getMyBootCamps(user_id, page, limit);
//         res.status(200).json({
//             status: 'success',
//             result: getAllBootCamps
//         });
//     } catch (err) {
//         console.error(err.message);
//         return next(new HttpError(Errors.Something_Went_Wrong));
//     }
// };

// module.exports = {
//     getMyCourses,
//     getMyCertificates,
//     getMyQuestions,
//     getMyBootCamps
// };
