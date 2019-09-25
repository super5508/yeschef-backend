const MongoClient = require('mongodb').MongoClient;
let config = require('../../config');
const notionKeyToDbKey = require('../../Notion2DB').notionKeyToDbKey;
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
}

const replaceDocsMongo = async (db, collectionName, docIdKey, dataArray) => {
    return new Promise(async (resolve, reject) => {
        const client = await getConnection();
        const collection = client.db(db).collection(collectionName);
        const replacePromisesArr = [];
        docIdKey = notionKeyToDbKey(docIdKey);

        dataArray.forEach(dataRow => {
            //convert dataRow keys
            const dbDataRow = {};
            Object.keys(dataRow).forEach(notionKey => {
                if (notionKey == "undefined") return;
                dbDataRow[notionKeyToDbKey(notionKey)] = dataRow[notionKey];
            });

            // perform actions on the collection object
            const query = {};
            query[docIdKey] = dbDataRow[docIdKey];
            collection.replaceOne(query,
                { $set: { ...dbDataRow } },
                { upsert: true });
        })


        Promise.all(replacePromisesArr).then(values => {
            resolve(values);
        }).catch(error => {
            reject(error);
        });
    });
};

const getDocMongo = (userId) => {
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
}

module.exports = {
    replaceDocsMongo
}
