require('dotenv').config()
const express = require("express");
const { ENVIRONMENT, PORT } = process.env
const app = express();
const db = require('./app/models')

const healthRoute = require("./app/routes/health.route");
const assignmentRoutes = require("./app/routes/assignment.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use("/healthz",healthRoute);
app.use("/v1/assignments",assignmentRoutes);

//Catch-all for unsupported routes
app.use((req, res) => {
  if (req.originalUrl !== '/healthz' && req.originalUrl !== '/v1/assignments') {
      res.status(404).json();
  } else if ((req.originalUrl == '/v1/assignments' && (req.method !== 'GET' || req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE')) || ( req.originalUrl == '/healthz' && req.method !== 'GET' )){
      res.status(405).json();
  }
});

if (ENVIRONMENT !== 'TEST') {
  db.connectionTest()
  db.syncDB()
}

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});