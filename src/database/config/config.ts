import { ConfigHelper } from 'common-utils';

// module.exports = {
//     "development": {
//         "dialect": "mysql",
//         "host": ConfigHelper.read("database.mysql.host"),
//         "username": ConfigHelper.read("database.mysql.username"),
//         "password": ConfigHelper.read("database.mysql.password"),
//         "database": ConfigHelper.read("database.mysql.database"),
//         "logging": false
//     },
// }


module.exports = {
    "development": {
        "dialect": "mysql",
        "host": process.env.MYSQL_ADDRESS,
        "username": process.env.MYSQL_USER,
        "password": process.env.MYSQL_PASSWORD,
        "database": process.env.MYSQL_DATABASE,
        "logging": false
    },
};
