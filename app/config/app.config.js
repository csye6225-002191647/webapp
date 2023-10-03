require('dotenv').config()

const {
  HOSTNAME,
  DBUSER,
  DBPASSWORD,
  PORT,
  DATABASE
} = process.env

module.exports = {
  HOSTNAME: 'localhost',
  USER: 'jarvis',
  PASSWORD: 'Rohit@123',
  PORT: 8080,
  DB: 'jarvis',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
}
