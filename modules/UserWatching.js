const { admin } = require('./FBAdmin');
const WatchingMongo = require('./MongoImpl/WatchingMongo');

const updateWatchingData = async (req,res) => {
  const id = req.body.userId;
  const response = await WatchingMongo.updateWatchingDataMongo(id, req.body);
  res.end('success');
}

const getWatchingData = async (req, res) => {
  const id = req.params.user;

  let snapshot = await WatchingMongo.getWatchingDataMongo(id);
  if (snapshot === null) {
    await WatchingMongo.addNewWatching(id);
    res.end(JSON.stringify({
      classId: "c01",
      lessonId: 1,
      name: "CHEF EDWARD LEE"
    }))
  }
  res.end(JSON.stringify(snapshot));
}

module.exports = {
  updateWatchingData,
  getWatchingData,
}