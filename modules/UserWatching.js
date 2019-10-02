const { admin } = require('./FBAdmin');
const WatchingMongo = require('./MongoImpl/WatchingMongo');

const updateWatchingData = (uid, data) => {
  
}

const getWatchingData = async (req, res) => {
    const id = req.params.user;
    console.log(`Getting History of User ${id}`);

    const snapshot = await WatchingMongo.getWatchingDataMongo(id);
    if (snapshot === null)
      await WatchingMongo.addNewWatching(id);
    //const snapshot = (await admin.database().ref('/users/' + id).once('value')).val();
    res.end(JSON.stringify(snapshot));
}

module.exports = {
    updateWatchingData,
    getWatchingData,
}