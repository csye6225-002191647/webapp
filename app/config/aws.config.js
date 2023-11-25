const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIAVWWARS6EZMZGKNKF',
  secretAccessKey: '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',
  region: 'us-east-1'
});

module.exports = AWS;