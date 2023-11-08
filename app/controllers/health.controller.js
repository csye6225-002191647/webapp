const sequelize = require("../config/db.config");
const { setCustomHeaders } = require("../utils/setHeaders");
const logger = require("../config/logger.config");
const statsd = require('node-statsd')
const appConfig = require('../config/app.config')

const client = new statsd({
    host: appConfig.METRICS_HOSTNAME,
    port: appConfig.METRICS_PORT,
    prefix: appConfig.METRICS_PREFIX
})

exports.checkHealth = async (req, res) => {
  client.increment('endpoint.health')
  var length = req.headers["content-length"];
  try {
    if ((req.method == "GET" && length > 0) || req.url.includes("?")) {
      logger.error("Health check failed due to invalid request");
      res.status(400).send();
    }else{
      await sequelize.authenticate();
      setCustomHeaders(res);
      res.status(200).send();
      logger.info("Health check passed");
    }
  } catch (error) {
    res.status(503).send();
    logger.fatal("Service unavailable");
  } finally {
    client.socket.close();
  }
};
