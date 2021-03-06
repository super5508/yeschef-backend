const MongoClient = require('mongodb').MongoClient;
let config = require('../../config');
config = config[process.env.CONFIG_ENV || "development"];
console.log("process.env");
console.log(process.env);
console.log("CONFIG_ENV = " + (process.env.CONFIG_ENV || "development"));

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

const getBetaDataMongo = () => {
  console.log('get beta news list');

  return new Promise(function (resolve, reject) {
    getConnection().then((client) => {
      const betaCollection = client.db("runtime").collection("betaNews");
      betaCollection.find({}).toArray((err, res) => {
        if (err) reject(err);
        resolve(res);
      })
    }).catch((err) => {
      reject(err);
    });
  });
};

const addNewBeta = (data) => {
  console.log('create a new beta news');
  return new Promise(function (resolve, reject) {
    getConnection().then((client) => {
      const betaCollection = client.db("runtime").collection("betaNews");
      // perform actions on the collection object
      betaCollection.insertOne(data).then(res => {
        resolve(res);
      })
    }).catch((err) => {
      reject(err);
    });
  });
}

const updateData = (data) => {
  console.log('update a beta news');
  return new Promise(function (resolve, reject) {
    getConnection().then((client) => {
      const betaCollection = client.db("runtime").collection("betaNews");
      // perform actions on the collection object
      betaCollection.insertOne(data).then(res => {
        resolve(res);
      })
    }).catch((err) => {
      reject(err);
    });
  });
}

module.exports = {
  getBetaDataMongo,
  addNewBeta,
  updateData
}
