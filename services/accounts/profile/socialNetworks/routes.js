const express = require('express');
const router = express.Router();
const SocialNetworkController = require('./controller');
const validator = require('../../../../middlewares/joi-validator');
const socialNetworkSchema = require('./schema');
const { checkToken } = require('../../../../middlewares/jwtCheck');

// Add social network by id
router.post('/', checkToken, SocialNetworkController.addSocialNetworks);

// Get all social networks
router.get('/', checkToken, SocialNetworkController.getAddedSocialNetworks);

// Delete social network by id
router.delete('/:social_network_id', checkToken, SocialNetworkController.deleteSocialNetworkById);

module.exports = router;
