const BetaMongo = require('./MongoImpl/BetaMongo');

const getNewsData = async (req, res) => {
  const snapshot = await BetaMongo.getBetaDataMongo();
  res.end(JSON.stringify(snapshot));
}

module.exports = {
  getNewsData,
}