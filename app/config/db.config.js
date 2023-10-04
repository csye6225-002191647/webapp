const {Sequelize} = require('sequelize');
const dbConfig = require('../config/app.config')

const sequelize = new Sequelize({
    HOST: "localhost",
    USER: "jarvis",
    DB: "jarvis",
    dialect: "postgres",
    port: 5432,
    PASSWORD: "jarvis"
  })

module.exports = sequelize;


