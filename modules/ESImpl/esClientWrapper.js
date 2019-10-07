const { Client } = require('@elastic/elasticsearch')
config = config[process.env.CONFIG_ENV || "development"];

const esClient = new Client();

exports.esClient = esClient;