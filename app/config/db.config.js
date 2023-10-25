const {Sequelize} = require('sequelize');
const dbConfig = require('../config/app.config')

const sequelize = new Sequelize({
  host: dbConfig.HOST,
  username: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  dialect: "postgres",
  // dialectOptions: dbConfig.dialectOptions,
  port: 5432
});

module.exports = sequelize;


