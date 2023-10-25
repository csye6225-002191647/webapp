const {Sequelize} = require('sequelize');
const dbConfig = require('../config/app.config')

const sequelizeParameters = {
  host: dbConfig.HOST,
  username: dbConfig.USER,
  database: dbConfig.DB,
  dialect: dbConfig.DIALECT,
  port: dbConfig.DBPORT,
  password: dbConfig.PASSWORD
}

if (dbConfig.HOST && dbConfig.HOST.includes('.rds.amazonaws.com')) {
  sequelizeParameters.dialectOptions = dbConfig.dialectOptions
}
const sequelize = new Sequelize(sequelizeParameters)

module.exports = sequelize;