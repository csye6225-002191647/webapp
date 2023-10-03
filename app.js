require('dotenv').config()
const express = require("express");
const { ENVIRONMENT, PORT, HOSTNAME } = process.env
const app = express();
const db = require('./app/models')

const healthRoute = require("./app/routes/health.route");
const assignmentRoutes = require("./app/routes/assignment.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
// app.use("/", routes);
app.use("/healthz",healthRoute);
app.use("/v1/assignments",assignmentRoutes);

//Catch-all for unsupported routes
app.use((req, res) => {
  if (req.originalUrl !== '/healthz' && req.originalUrl !== '/v1/assignments') {
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