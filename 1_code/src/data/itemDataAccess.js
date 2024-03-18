const pool = require('../config/database');
const debug = require('debug')('app:itemDataAccess');
const chalk = require('chalk');


class ItemDataAccess {

    // createItem
    async createItem(createRequest) {
        try {
            const { itemGuid, condition, isOnHold, baseItemId } = createRequest;
            const sqlQuery = `CALL rentalItem_Insert(?, ?, ?, ?)`;
            await pool.query(sqlQuery, [itemGuid, condition, isOnHold, baseItemId], (error, results, fields) => {
                if (error) {
                    throw error;
                }
            });
            return true;

        } catch (error) {
            debug(error);
            return false;
        }
    }
    // updateItem
    async updateItem(updateRequest) {
        try {
            const { itemGuid, condition, isOnHold } = createRequest;
            const sqlQuery = `CALL rentalItem_UpdateByRentalItemGuid(?, ?, ?)`;
            await pool.query(sqlQuery, [itemGuid, condition, isOnHold], (error, results, fields) => {
                if (error) {
                    throw error;
                }
            });
            return true;

        } catch (error) {
            debug(error);
            return false;
        }
    }
    // getItemByGuid
    async getItemByGuid(guidInput) {
        try {
            const sqlQuery = `CALL rentalItem_SelectByRentalItemGuid(?)`;
            const dbResponse = await pool.query(sqlQuery, [guidInput]);
            const rentalItem = dbResponse[0][0];

            rentalItem.isCheckedOut = rentalItem.isCheckedOut == 1 ? true : false;
            rentalItem.isAvailable = !rentalItem.isCheckedOut && !rentalItem.isOnHold;

            return rentalItem;
        } catch (error) {
            debug(error);
        }
    }

    async getItemListByGuidFilter(guidFilter) {
        try {
            const sqlQuery = `CALL rentalItem_Filter(?)`;
            const dbResponse = await pool.query(sqlQuery, [guidFilter]);
            const filteredList = dbResponse[0];
            return filteredList;
        } catch (error) {
            debug(error);
        }
    }

    // getItemByBaseId
    async getItemByBaseId(baseItemId) {
        try {
            const sqlQuery = `CALL rentalItem_SelectByBaseItemId(?)`;
            const dbResponse = await pool.query(sqlQuery, [baseItemId]);
            let rentalItem = dbResponse[0];
            rentalItem = rentalItem.map(x =>{
                x.isCheckedOut = x.isCheckedOut == 1 ? true : false;
                x.isAvailable = !x.isCheckedOut && !x.isOnHold;
                return x;
            });
            return rentalItem;
        } catch (error) {
            debug(error);
        }
    }
    // deleteItemByItemGuid
    async deleteItemByItemGuid(itemGuidToDelete) {
        try {
            const sqlQuery = `Call media_DeleteById(?)`;

            await pool.query(
                sqlQuery,
                [itemGuidToDelete],
                (error, results, fields) => {
                    if (error) {
                        throw error;
                    }
                }
            );
            return true;

        } catch (error) {
            debug(error);
            return false;
        }
    }
}

module.exports = ItemDataAccess;
