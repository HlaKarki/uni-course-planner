// Get an instance of mysql we can use in the app
const mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_kshaph',
    password        : 'lrhvbskMY0mm',
    database        : 'cs340_kshaph'
})

// Export it for use in our application
module.exports.pool = pool;
