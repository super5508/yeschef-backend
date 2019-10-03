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
        getConnection().then((client) => {
            const historyCollection = client.db("runtime").collection("userWatching");
            // perform actions on the collection object
            historyCollection.updateOne({ id: userId },
                { $set: { ...data } },
                { upsert: true }).then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });

        });
    });
};

const getWatchingDataMongo = (userId) => {
    console.log(`get watching history of user ${userId}`);
    return new Promise(function (resolve, reject) {
        getConnection().then((client) => {
            const historyCollection = client.db("runtime").collection("userWatching");
            // perform actions on the collection object
            const chefCollection = client.db("runtime").collection("classes");
            historyCollection.findOne({ id: userId }).then((results) => {
                if (results !== null) {
                    chefCollection.findOne({ classId: results.lessonId }).then(res => {
                        if (res !== null) {
                            resolve({
                                ...results,
                                name: res.name,
                                link: res.classId
                            });
                        } else {
                            resolve(results);
                        }
                    }).catch(err => {
                        reject(err);
                    });
                } else {
                    resolve(results);
                }
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });
};

const addNewWatching = (userId) => {
    console.log(`create a new watchHistory for user ${userId}`);
    return new Promise(function (resolve, reject) {
        getConnection().then((client) => {
            const historyCollection = client.db("runtime").collection("userWatching");
            // perform actions on the collection object
            historyCollection.insertOne({
                id: userId,
                lessonId: -1,
                progress: 0,
            })
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
  updateWatchingDataMongo,
  getWatchingDataMongo,
  addNewWatching
}
