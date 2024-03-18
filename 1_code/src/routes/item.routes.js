const express = require('express');
const debug = require('debug')('app:itemRouter');
const ItemController = require('../controllers/item.controller');
const authValidator = require('../middleware/validators/authValidator.middleware');

const itemRouter = express.Router();
const itemController = new ItemController();

itemRouter.post('/', itemController.createOrUpdateItem.bind(itemController));
itemRouter.get('/:rentalItemGuid', itemController.getItemDetailsViewByGuid.bind(itemController));
itemRouter.get('/qrcode/:rentalItemGuid', itemController.getItemQrCode.bind(itemController));
itemRouter.get('/baseItem/:baseItemId', itemController.getItemByBaseItemId.bind(itemController));
itemRouter.delete('/:rentalItemBuid', itemController.deleteItemByGuid.bind(itemController));





module.exports = itemRouter;