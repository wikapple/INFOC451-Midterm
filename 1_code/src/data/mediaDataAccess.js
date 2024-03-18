const pool = require('../config/database');
const debug = require('debug')('app:mediaDataAccess');
const chalk = require('chalk');


class MediaDataAccess {

    async getAllCategories() {
        try {
            const sqlQuery = `CALL category_SelectAll()`;
            const queryResult = await pool.query(sqlQuery, []);
            return queryResult[0];

        } catch (error) {
            debug(error);
        }
    }

    async getAllMediaTypes() {
        try {
            const sqlQuery = `CALL mediaType_SelectAll()`;
            const queryResult = await pool.query(sqlQuery, []);
            return queryResult[0];

        } catch (error) {
            debug(error);
        }
    }

    async getMediaListByType(typeId) {
        try {
            const sqlQuery = `CALL media_SelectByType(?)`;
            const queryResult = await pool.query(sqlQuery, [typeId]);
            let mediaList = queryResult[0];

            for (let media of mediaList) {
                const categoryQuery = `Call category_SelectByMediaId(?)`;
                const categoriesQueryResult = await pool.query(categoryQuery, [media.id])
                media.categories = categoriesQueryResult[0];
            }
            return mediaList;
        } catch (error) {
            debug(error);
        }
    }
    async getMediaListByTypeAndFilter(typeId, filterValue) {
        try {
            const sqlQuery = `CALL media_Filter(?,?)`;
            const queryResult = await pool.query(sqlQuery, [typeId, filterValue]);
            let mediaList = queryResult[0];

            for (let media of mediaList) {
                const categoryQuery = `Call category_SelectByMediaId(?)`;
                const categoriesQueryResult = await pool.query(categoryQuery, [media.id])
                media.categories = categoriesQueryResult[0];
            }
            return mediaList;
        } catch (error) {
            debug(error);
        }
    }

    async createMedia(createRequest) {
        try {
            const { uniqueIdentifier, name, description, publisher, type, size, author } = createRequest;


            const isChildSafe = createRequest.isChildSafe ? true : false;
            let categoryList = createRequest['categories[]'];
            if(Array.isArray(categoryList)) {
                categoryList= categoryList.join();
            } 
            const sqlQuery = `CALL media_Insert(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const dbResponse = await pool.query(
                sqlQuery,
                [uniqueIdentifier, name, description, publisher, isChildSafe, type, size, categoryList, author],
                (error, results, fields) => {
                    if (error) {
                        throw error;
                    }
                }
            );            
            return true;

        } catch (error) {
            debug(error);
            throw error;
        }
    }
    async updateMedia(updateRequest) {
        try {
            const { id, uniqueIdentifier, name, description, publisher, type, size, author, } = updateRequest;
            const isChildSafe = updateRequest.isChildSafe ? true : false;
            let categoryList = updateRequest['categories[]'];
            if(Array.isArray(categoryList)) {
                categoryList= categoryList.join();
            } 
            const sqlQuery = `CALL media_UpdateById(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            await pool.query(
                sqlQuery,
                [id, uniqueIdentifier, name, description, publisher, isChildSafe, type, categoryList, author, size],
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

    async getMediaById(mediaId) {
        try {
            const sqlQuery = `CALL media_SelectById(?)`;
            const dbResult = await pool.query(sqlQuery, [mediaId],
                (error, results, fields) => {
                    if (error) {
                        throw error;
                    }
                }
            );
            let media = dbResult[0][0];
            const categoryQuery = `Call category_SelectByMediaId(?)`;
            const categoriesQueryResult = await pool.query(categoryQuery, [media.id])
            media.categories = categoriesQueryResult[0];
            return media;
        } catch (error) {
            debug(error);
            return;
        }
    }
    async deleteMediaById(mediaIdToDelete) {
        try {
            const sqlQuery = `Call media_DeleteById(?)`;

            await pool.query(
                sqlQuery,
                [mediaIdToDelete],
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

module.exports = MediaDataAccess;
