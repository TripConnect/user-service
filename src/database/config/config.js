import {ConfigHelper} from "common-utils";

export default {
  "dialect": "mysql",
  "host": ConfigHelper.read("database.mysql.host"),
  "username": ConfigHelper.read("database.mysql.username"),
  "password": ConfigHelper.read("database.mysql.password"),
  "database": ConfigHelper.read("database.mysql.database"),
  "logging": false
};
