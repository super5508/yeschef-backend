const { admin } = require('./FBAdmin');
const WatchingMongo = require('./MongoImpl/WatchingMongo');

const updateWatchingData = async (req,res) => {
  const id = req.body.userId;
  const response = await WatchingMongo.updateWatchingDataMongo(id, req.body);
  res.end(response);
}

const getWatchingData = async (req, res) => {
  const id = req.params.user;

  let snapshot = await WatchingMongo.getWatchingDataMongo(id);
  res.end(JSON.stringify(snapshot));
}

module.exports = {
  updateWatchingData,
  getWatchingData,
}