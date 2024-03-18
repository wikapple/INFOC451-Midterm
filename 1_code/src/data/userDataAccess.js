const pool = require('../config/database');
const debug = require('debug')('app:userDataAccess');

class UserDataAccess {
    async getAllUsers() {
        try{
            const sqlQuery = `CALL user_SelectAll()`;
            const results = await pool.query(sqlQuery, []);
            return results;
        }
        catch (error) {
            debug(error);
        }
    }
    
    async getUserByEmail(email) {
        try{
            const sqlQuery = `CALL user_SelectByEmail(?)`;
            const result = await pool.query(sqlQuery, [email]);
            return result[0][0];
        }
        catch (error) {
            debug(error);
        }
    }
    
    async getUserById(id) {
        try{
            const sqlQuery = `CALL user_SelectById(?)`;
            const result = await pool.query(sqlQuery, [id]);
            return result[0][0];
        }
        catch (error) {
            debug(error);
        }
    }
    
    async createMember(name, phoneNumber, email, passwordHash, dob) {
        try {
            const sqlQuery = `Call memberAccount_Insert(?,?,?,?,?, @IdOutput); select @IdOutput;`;
            const result = await pool.query(sqlQuery, [name, phoneNumber, email, passwordHash, dob]);
            
            return result[1][0]['@IdOutput'];
        }
        catch (error) {
            debug(error);
        }
    }
    
    async updateUser(id, name, phoneNumber, email, passwordHash, dob, userRoleId) {
        try {
            const sqlQuery = `Call user_UpdateById(?,?,?,?,?,?,?)`
            const result = await pool.query(sqlQuery, [id, name, phoneNumber, email, passwordHash, dob, userRoleId]);
            return result.IsSuccess;
        }
        catch (error) {
            debug(error);
        }
    }
    
    async selectAllRoles() {
        try{
            const sqlQuery = `CALL role_SelectAll()`;
            const results = await pool.query(sqlQuery, []);
            return results;
        }
        catch (error) {
            debug(error);
        }
    }
}

module.exports = UserDataAccess;

