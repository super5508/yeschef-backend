const MongoClient = require('mongodb').MongoClient;
let config = require('../../config');
config = config[process.env.CONFIG_ENV || "development"];

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

const updateUserDataMongo = (userId, data) => {
    return new Promise(function (resolve, reject) {
        getConnection().then((client) => {
            const usersCollection = client.db("runtime").collection("users");
            // perform actions on the collection object
            usersCollection.updateOne({ userId },
                { $set: { ...data } },
                { upsert: true }).then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });

        });
    });
};

const getUserDataMongo = (userId) => {
    return new Promise(function (resolve, reject) {
        getConnection().then((client) => {
            const usersCollection = client.db("runtime").collection("users");
            // perform actions on the collection object
            usersCollection.findOne({ userId }).then((results) => {
                resolve(results);
            }).catch((err) => {
                reject(err);
            });
        });
    });
};

module.exports = {
    updateUserDataMongo,
    getUserDataMongo
}
