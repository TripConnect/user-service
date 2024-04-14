require('dotenv').config()

module.exports = {
    "development": {
        "username": process.env.MYSQL_USERNAME,
        "password": process.env.MYSQL_PASSWORD,
        "database": process.env.MYSQL_DATABASE,
        "host": process.env.MYSQL_ADDRESS,
        "dialect": "mysql"
    },
}