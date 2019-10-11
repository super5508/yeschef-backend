const MongoClient = require('mongodb').MongoClient;
let config = require('../../config');
config = config[process.env.CONFIG_ENV || "development"];
console.log("process.env");
console.log(process.env);
console.log("CONFIG_ENV = " + process.env.CONFIG_ENV);

const uri = config.mongo.url;
const client = new MongoClient(uri, { useNewUrlParser: true });
const getConnection = () => {
    return new Promise(function (resolve, reject) {
        if (!client.isConnected()) {
            client.connect(err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(client);
            });
        } else {
            resolve(client);
        }
    });
};

const updateWatchingDataMongo = (userId, data) => {
    return new Promise(function (resolve, reject) {
        getConnection().then(async (client) => {
            const historyCollection = client.db("runtime").collection("userWatching");
            const chefCollection = client.db("runtime").collection("chefs");
            const currentChef = await chefCollection.findOne({ classId: data.classId });
            // perform actions on the collection object
            await historyCollection.updateOne({ id: userId }, { $set: { ...data, chefName: currentChef.class } }, { upsert: true })
            resolve('updated');
        });
    });
};

const getWatchingDataMongo = (userId) => {
    console.log('get watching history of user ' + userId);
    return new Promise(function (resolve, reject) {
        getConnection().then(async (client) => {
            const historyCollection = client.db("runtime").collection("userWatching");
            const currentUserHistory = await historyCollection.findOne({ id: userId });
            if (currentUserHistory) {
                resolve(currentUserHistory);
            } else {
                const insertedUser = await historyCollection.insertOne({
                    id: userId,
                    classId: "c00",
                    lessonId: "s00",
                    chefName: "THE WORLD'S BEST CHEFS"
                });
                resolve(insertedUser.ops[0]);
            }
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = {
  updateWatchingDataMongo,
  getWatchingDataMongo
}
