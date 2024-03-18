const debug = require('debug')('app:database');

const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 5,
    multipleStatements: true
});

// Connect and check for errors:
pool.getConnection((err, connection) => {

   if(err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        debug('Database connection lost');
    }
    else if (err.code === 'ER_CON_COUNT_ERROR') {
        debug('Database has too many connections');
    }
    else if (err.code === 'ECONNREFUSED') {
        debug('Database connection was refused');
    }
    else {
        debug(`database error: error-code:${err.code}`);
    }
   }
   if (connection) connection.release();
   
   return;
});

module.exports = pool;