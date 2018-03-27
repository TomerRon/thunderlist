require('dotenv').config()

module.exports = {
  development: {
    username: process.env.DB_DEVELOPMENT_USERNAME,
    password: null,
    database: process.env.DB_DEVELOPMENT_DBNAME,
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
    operatorsAliases: false
  },
  production: {
    username: process.env.DB_PRODUCTION_USERNAME,
    password: process.env.DB_PRODUCTION_PASSWORD,
    database: process.env.DB_PRODUCTION_DBNAME,
    host: process.env.DB_PRODUCTION_HOST,
    dialect: "mysql",
    logging: false,
    operatorsAliases: false
  }
}
