const { Client } = require('@elastic/elasticsearch');
let config = require('../../config');
config = config[process.env.CONFIG_ENV || "development"];

const esClient = new Client(config.es);

exports.esClient = esClient;