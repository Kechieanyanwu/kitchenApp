require("dotenv").config();

process.env.POSTGRES_DEV_USER = "nkechianyanwu";
process.env.POSTGRES_DEV_PASSWORD = "";
process.env.POSTGRES_DEV_DB_NAME = "kitchenapp_dev";
process.env.POSTGRES_DEV_HOST = "127.0.0.1";

process.env.POSTGRES_TEST_USER = "nkechianyanwu";
process.env.POSTGRES_TEST_PASSWORD = "";
process.env.POSTGRES_TEST_DB_NAME = "kitchenapp_test";
process.env.POSTGRES_TEST_HOST = "127.0.0.1";


process.env.POSTGRES_USER = "nkechianyanwu";
process.env.POSTGRES_PASSWORD = "";
process.env.POSTGRES_DB_NAME = "kitchenapp_prod";
process.env.POSTGRES_HOST = "127.0.0.1";


module.exports = {
  development: {
    username: process.env.POSTGRES_DEV_USER,
    password: process.env.POSTGRES_DEV_PASSWORD,
    database: process.env.POSTGRES_DEV_DB_NAME,
    host: process.env.POSTGRES_DEV_HOST,
    dialect: 'postgres'
  },
  test: {
    username: process.env.POSTGRES_TEST_USER,
    password: process.env.POSTGRES_TEST_PASSWORD,
    database: process.env.POSTGRES_TEST_DB_NAME,
    host: process.env.POSTGRES_TEST_HOST,
    dialect: 'postgres'
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres'
  }
}

