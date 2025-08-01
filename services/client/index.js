const express = require('express');
const router = express.Router();

const version1 = require('./version 1/index');

const { checkTokenClientAPIs } = require('../../middlewares/jwtCheck');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(asyncHandler(checkTokenClientAPIs));

// Version 1 Router
router.use('/v1', version1);

module.exports = router;
