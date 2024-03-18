const express = require('express');
const debug = require('debug')('app:apiRouter');
const MediaApiController = require('../api/media.api.controller');
const authValidator = require('../middleware/validators/authValidator.middleware');
const ItemApiController = require('../api/item.api.controller');
const MemberApiController = require('../api/member.api.controller');
const RentalAgreementApiController = require('../api/rentalAgreement.api.controller');
const apiRouter = express.Router();
const mediaApiController = new MediaApiController();
const itemApiController = new ItemApiController;
const memberApiController = new MemberApiController();
const rentalAgreementApiController = new RentalAgreementApiController();

// users

// members
apiRouter.get('/member/', memberApiController.getMembers.bind(memberApiController));

// media types

// media
apiRouter.get('/mediacategories', mediaApiController.getCategoryList.bind(mediaApiController));
apiRouter.get('/mediaTypes', mediaApiController.getMediaTypeList.bind(mediaApiController));
apiRouter.get('/media/list/:typeId', mediaApiController.getMediaListByType.bind(mediaApiController));

apiRouter.post('/media', mediaApiController.addOrUpdateMedia.bind(mediaApiController));
apiRouter.delete('/media/:mediaId', mediaApiController.deleteMedia.bind(mediaApiController));
apiRouter.get('/media/:mediaId', mediaApiController.getMedia.bind(mediaApiController));

// instruments

// rental item
apiRouter.get('/item', itemApiController.getItemsFilteredByGuid.bind(itemApiController));
apiRouter.post('/item', itemApiController.createOrUpdateItem.bind(itemApiController));
apiRouter.get('/item/:rentalItemGuid', itemApiController.getItemByGuid.bind(itemApiController));
apiRouter.get('/item/qrcode/:rentalItemGuid', itemApiController.getItemQrCode.bind(itemApiController));
apiRouter.get('/item/baseItem/:baseItemId', itemApiController.getItemByBaseItemId.bind(itemApiController));
apiRouter.delete('/item/:rentalItemBuid', itemApiController.deleteItemByGuid.bind(itemApiController));

// rental agreements
apiRouter.post('/rentalagreement/checkout',authValidator.checkAuthenticatedEmployee, rentalAgreementApiController.submitRentalAgreements.bind(rentalAgreementApiController));

module.exports = apiRouter;