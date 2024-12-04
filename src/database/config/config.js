require('dotenv').config()

module.exports = {
    "development": {
        "dialect": "mysql",
        "host": process.env.MYSQL_ADDRESS,
        "username": process.env.MYSQL_USER,
        "password": process.env.MYSQL_PASSWORD,
        "database": process.env.MYSQL_DATABASE,
        "logging": false
    },
}