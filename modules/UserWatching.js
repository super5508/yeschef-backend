const { admin } = require('./FBAdmin');
const WatchingMongo = require('./MongoImpl/WatchingMongo');

const updateWatchingData = async (uid,data) => {
  const id = data.req.body.id;
  await WatchingMongo.updateWatchingDataMongo(id, data.req.body);
}

const getWatchingData = async (req, res) => {
  const id = req.params.user;

  const snapshot = await WatchingMongo.getWatchingDataMongo(id);
  if (snapshot === null) {
    snapshot = await WatchingMongo.addNewWatching(id);
    res.end('created');
  }
  res.end(JSON.stringify(snapshot));
}

module.exports = {
  updateWatchingData,
  getWatchingData,
}