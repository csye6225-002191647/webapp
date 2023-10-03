require('dotenv').config()

const {
  HOSTNAME,
  DBUSER,
  DBPASSWORD,
  PORT,
  DATABASE
} = process.env

module.exports = {
  HOSTNAME,
  USER: DBUSER,
  PASSWORD: DBPASSWORD,
  PORT,
  DB: DATABASE,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
}
