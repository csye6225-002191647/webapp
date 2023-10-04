const sequelize = require("../config/db.config");
const { setCustomHeaders } = require('../utils/setHeaders');

exports.checkHealth = async (req, res) => {
    var length = req.headers['content-length'];
    if ((req.method == 'GET' && length > 0) || req.url.includes('?')) {
      res.status(400).send();
    }
    try {
        await sequelize.authenticate();
        setCustomHeaders(res);
        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(503).send();
    }
};
