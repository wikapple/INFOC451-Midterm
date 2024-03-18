const express = require('express');
const debug = require('debug')('app:itemRouter');
const MediaController = require('../controllers/media.controller');
const authValidator = require('../middleware/validators/authValidator.middleware');

const mediaRouter = express.Router();
const mediaController = new MediaController();

mediaRouter.post('/', mediaController.addOrUpdateMedia.bind(mediaController));
mediaRouter.delete('/:mediaId', mediaController.deleteMedia.bind(mediaController));
mediaRouter.get('/', mediaController.mediaListView.bind(mediaController));
mediaRouter.get('/:mediaId', mediaController.getMediaDetailsView.bind(mediaController));
mediaRouter.get('/createOrEdit/:mediaId', mediaController.getCreateOrEditView.bind(mediaController));




module.exports = mediaRouter;