const express = require('express');
const router = express.Router({ mergeParams: true });
const reducedLinkController = require('./controller');

// Redirect to original Url
router.get('/:link_id', reducedLinkController.redirectReducedLink);

module.exports = router;
