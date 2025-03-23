const { ConfigHelper } = require("common-utils");

module.exports = {
  "dialect": "mysql",
  "host": ConfigHelper.read("database.mysql.host"),
  "username": ConfigHelper.read("database.mysql.username"),
  "password": ConfigHelper.read("database.mysql.password"),
  "database": ConfigHelper.read("database.mysql.database"),
  "logging": false
};
