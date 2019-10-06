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

const updateBetaDataMongo = (newsId, data) => {
    return new Promise(function (resolve, reject) {
        getConnection().then((client) => {
            const newsCollection = client.db("runtime").collection("betaNews");
            // perform actions on the collection object
            newsCollection.updateOne({ id: newsId },
                { $set: { ...data } },
                { upsert: true }).then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });

        });
    });
};

const getBetaDataMongo = () => {
    console.log('get beta news list');
    
    return new Promise(function (resolve, reject) {
      getConnection().then((client) => {
        const newsCollection = client.db("runtime").collection("betaNews");
          newsCollection.find({}).toArray((err, res) => {
            if (err) reject(err);
            resolve(res);
          })
        }).catch((err) => {
          reject(err);
        });
    });
};

const addNewBeta = (newsId) => {
    console.log('create a new beta news' + newsId);
    return new Promise(function (resolve, reject) {
        getConnection().then((client) => {
            const newsCollection = client.db("runtime").collection("userBeta");
            // perform actions on the collection object
            newsCollection.insertOne({
              createdDate: '',
              title: '',
              content: '',
              hyperlinks: [],
              portfolio: '',
              portfolioDescription: '',
              closeable: false,
              key: '',
            })
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
  updateBetaDataMongo,
  getBetaDataMongo,
  addNewBeta
}
