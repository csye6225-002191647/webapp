require('dotenv').config();

const {
  HOSTNAME,
  DBUSER,
  DBPASSWORD,
  PORT,
  DATABASE,
  DBPORT

} = process.env;

module.exports = {
  HOST: HOSTNAME,
  USER: DBUSER,
  PASSWORD: DBPASSWORD,
  PORT,
  DB: DATABASE,
  DBPORT,
  DIALECT: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};
