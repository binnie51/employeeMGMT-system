const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    },
    console.log('Connected to the CMS database.')
);

module.exports = db;