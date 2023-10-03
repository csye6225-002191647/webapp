require('dotenv').config()
const express = require("express");
const { ENVIRONMENT, PORT, HOSTNAME } = process.env
const app = express();
const db = require('./app/models')
const routes = require("./app/routes/routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use("/", routes);

// Catch-all for unsupported routes
app.use((req, res) => {
  if (req.method === 'GET' && req.originalUrl !== '/healthz') {
      res.status(404).send();
  } else {
      res.status(405).send();
  }
});

if (ENVIRONMENT !== 'TEST') {
  db.connectionTest()

  db.syncDB()
}

// set port, listen for requests
// const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});