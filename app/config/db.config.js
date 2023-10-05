const {Sequelize} = require('sequelize');
const dbConfig = require('../config/app.config')

const sequelize = new Sequelize({
    HOST: dbConfig.HOSTNAME,
    USER: dbConfig.USER,
    DB: dbConfig.DB,
    dialect: "postgres",
    port: 5432,
    PASSWORD: dbConfig.PASSWORD
  })

module.exports = sequelize;


