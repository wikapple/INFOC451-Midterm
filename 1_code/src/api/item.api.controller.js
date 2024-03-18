const chalk = require('chalk');
const debug = require('debug')('app:itemController');
const ItemDataAccess = require('../data/itemDataAccess');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

class ItemApiController {

    constructor() {
        this._itemDataAccess = new ItemDataAccess();
    }


    // createOrUpdateItem
    async createOrUpdateItem(req, res) {
        const isNewItem = req.body.rentalItemGuid ? false : true;

        if (isNewItem) {
            await this.createNewItem(req, res);
        }
        else {
            await this.updateItem(req, res);
        }
    }

    async createNewItem(req, res) {
        let dbParams = {
            itemGuid: uuidv4(),
            isAvailable: req.body.isAvailable ? true : false,
            condition: req.body.condition,
            baseItemId: req.body.baseItemId
        };

        const isCreateSuccessful = await this._itemDataAccess.createItem(dbParams);

        if (isCreateSuccessful) {
            res.status(200).json({ idAssigned: dbParams.itemGuid });
        } else {
            res.sendStatus(500);
        }
    }

    async updateItem(req, res) {
        let dbParams = {
            itemGuid: req.body.itemGuid,
            isAvailable: req.body.isAvailable ? true : false,
            condition: req.body.condition,
        };

        const isUpdateSuccessful = await this._itemDataAccessitemDataAccess.updateItem(dbParams);

        if (isUpdateSuccessful) {
            res.sendStatus(204);
        } else {
            res.sendStatus(500);
        }
    }

    // getItemByGuid
    async getItemByGuid(req, res) {
        const rentalItemGuid = req.params.rentalItemGuid;
        const rentalItem = await this._itemDataAccess.getItemByGuid(rentalItemGuid);
        return res.status(200).json(rentalItem);
    }

    async getItemsFilteredByGuid(req, res) {
        const filterValue = req.query.filter;
        if(filterValue) {
            const rentalItemList = await this._itemDataAccess.getItemListByGuidFilter(filterValue);
            return res.status(200).json(rentalItemList);
        } else {
            return res.status(400);
        }
    }


    // getItemByBaseItemId
    async getItemByBaseItemId(req, res) {
        const baseItemId = req.params.baseItemId;
        const rentalItem = await this._itemDataAccess.getItemByBaseId(baseItemId);
        return res.status(200).json(rentalItem);
    }

    // delete item
    async deleteItemByGuid(req, res) {
        const rentalItemGuid = req.params.rentalItemGuid;
        await this._itemDataAccess.deleteItemByItemGuid(rentalItemGuid);
        return res.status(204);
    }

    async getItemQrCode(req, res) {
        const guid = req.params.rentalItemGuid;

        try {
            const qrCodeDataUrl = await this.generateQRCode(guid);
            res.status(200).send(qrCodeDataUrl);
        } catch (error) {
            debug(error);
            res.sendStatus(500);
        }
    }

    async generateQRCode(guid) {
        try {
            const qrCodeDataUrl = await QRCode.toDataURL(guid);
            return qrCodeDataUrl;
        } catch(error) {
            debug(error);
            throw error;
        }
    }
}

module.exports = ItemApiController;
