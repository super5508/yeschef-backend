const BetaMongo = require('./MongoImpl/BetaMongo');

const getNewsData = async (req, res) => {
  const snapshot = await BetaMongo.getBetaDataMongo();
  res.end(JSON.stringify(snapshot));
}

const addNewsBeta = async (req, res) => {
  await BetaMongo.addNewBeta(req.body);
  res.end('Success');
}

const updateData = async (req, res) => {
  await BetaMongo.updateData(req.body);
  res.end('success');
}

module.exports = {
  getNewsData,
  addNewsBeta,
  updateData
}