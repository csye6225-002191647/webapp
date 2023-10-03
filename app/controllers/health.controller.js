const sequelize = require("../config/db.config");

exports.checkHealth = async (req, res) => {
    var length = req.headers['content-length'];
    if ((req.method == 'GET' && length > 0) || req.url.includes('?')) {
      res.status(400).send();
    }
    try {
        await sequelize.authenticate();
        res.set('Cache-control', 'no-cache');
        res.status(200).send();
    } catch (error) { 
        res.status(503).send();
    }
};
