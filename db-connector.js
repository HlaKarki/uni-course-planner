// Get an instance of mysql we can use in the app
const mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'INSERT_VALUE',
    password        : 'INSERT_VALUE',
    database        : 'INSERT_VALUE'
})

// Export it for use in our application
module.exports.pool = pool;
