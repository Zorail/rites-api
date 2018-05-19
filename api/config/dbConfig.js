const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'imallurs',
    database: 'rites_api'
})

module.exports = connection
