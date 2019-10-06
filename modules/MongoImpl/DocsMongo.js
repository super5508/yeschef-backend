const Classes = require('../Classes');
const MongoClient = require('mongodb').MongoClient;
let config = require('../../config');
const notionKeyToDbKey = require('../../Notion2DB').notionKeyToDbKey;
config = config[process.env.CONFIG_ENV || "development"];
console.log("CONFIG_ENV = " + process.env.CONFIG_ENV);
const uri = config.mongo.url;
const client = new MongoClient(uri, { useNewUrlParser: true });
const getConnection = () => {
    return new Promise(function (resolve, reject) {
        if (!client.isConnected()) {
            console.log("create mongo connection");
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

        dataArray.forEach(dataRow => {
            //convert dataRow keys
            const dbDataRow = {};
            Object.keys(dataRow).forEach(notionKey => {
                if (notionKey == "undefined") return;
                dbDataRow[notionKey] = dataRow[notionKey];
            });

            // perform actions on the collection object
            const query = {};
            query[docIdKey] = dbDataRow[docIdKey];
            collection.replaceOne(query,
                { ...dbDataRow },
                { upsert: true });
        })


        Promise.all(replacePromisesArr).then(values => {
            resolve(values);
        }).catch(error => {
            reject(error);
        });
    });
};

const generateDocs = async () => {
    return new Promise(function (resolve, reject) {
        const classes = {};
        getConnection().then((client) => {
            const classesCollection = client.db("runtime").collection("classes");
            const lessonsCollection = client.db("runtime").collection("lessons");
            const dishesCollection = client.db("runtime").collection("dishes");
            const dishesCollection = client.db("runtime").collection("dishes");
            // perform actions on the collection object
            classesCollection.find().forEach(async (classItr) => {
                const chefId = classItr.chefId;
                const chef = await client.db("runtime").collection("chefs").findOne({ chefId });

                Classes.saveClass({
                    id: classItr.classId,
                    about: chef.bio,
                    chefImg: classItr.photo,
                    description: classItr.description,
                    lessons: classItr.lessonsId,
                    skills: classItr.techniques,
                    isStaging: classItr.staging,
                    isComingSoon: classItr.comingSoon,
                    trailer: classItr.trailer,
                    duration: 0, //TBD
                    date: 0,//TBD - do we need it?
                    classTitle: classItr.title,
                    chefName: classItr.chefPerson,
                    social: {
                        facebook: chef.fbUrl,
                        instegram: chef.igUrl,
                        twitter: chef.twUrl
                    }
                });

                if (classItr.lessonsId && classItr.lessonsId.length) {
                    classItr.lessonsId.forEach(async lessonId => {
                        const lesson = await lessonsCollection.findOne({ lessonId });
                        const supplies = await lessonsCollection.findOne({ lessonId });
                        const lessonDoc = {
                            thumbnail: lesson.thumbnail,
                            cuisine: [],
                            description: "",
                            dietary: [],
                            duration: 0, //TBD - need to get the duration of the video 
                            gear: {}, //TBD - split the list across the sub dishes and handle the main dish list
                            ingredients: {}, //TBD - split the list across the sub dishes and handle the main dish list
                            shorthand: {}, //TBD - split the list across the sub dishes and handle the main dish list
                            skills: [],
                            times: {
                                handsOn: 0, //TBD
                                total: 0 //TBD
                            }
                        };

                        if (typeof lesson.dishId === "string") {
                            lesson.dishId = lesson.dishId ? [lesson.dishId] : [];
                        }

                        lesson.dishId.forEach(async dishId => {
                            const dish = await dishesCollection.findOne({ dishId });
                            lessonDoc.cuisine.concat(dish.cuisine);
                            lessonDoc.description += dish.description;
                            lessonDoc.dietary.concat(dish.dietary);
                            lessonDoc.skills.concat(dish.skills);
                        })
                    })
                }
            })
        });
    });
}

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
    replaceDocsMongo,
    generateDocs
}