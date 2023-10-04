const {Sequelize} = require('sequelize');
const dbConfig = require('../config/app.config')

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOSTNAME,
    port: 5432,
    dialect: 'postgres',
  })

module.exports = sequelize;


