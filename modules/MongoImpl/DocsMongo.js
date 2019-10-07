const Classes = require('../Classes');
const Lessons = require('../Lessons');
const MongoClient = require('mongodb').MongoClient;
let config = require('../../config');
const notionKeyToDbKey = require('../../Notion2DB').notionKeyToDbKey;

config = config[process.env.CONFIG_ENV || "development"];


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
        getConnection().then(async (client) => {
            const classesCollection = client.db("runtime").collection("classes");
            const lessonsCollection = client.db("runtime").collection("lessons");
            const dishesCollection = client.db("runtime").collection("dishes");
            const suppliesCollection = client.db("runtime").collection("supplies");
            const shorthandCollection = client.db("runtime").collection("shorthand");
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
                console.log(`saved class: ${classItr.classId} `);


                if (classItr.lessonsId && classItr.lessonsId.length) {
                    classItr.lessonsId.forEach(async lessonId => {
                        const lesson = await lessonsCollection.findOne({ lessonId });
                        const lessonDoc = {
                            id: lessonId,
                            thumbnail: lesson.thumbnail,
                            cuisine: [],
                            description: "",
                            dietary: [],
                            duration: 1000,
                            gear: {},
                            ingredients: {},
                            shorthand: {},
                            skills: [],
                            times: {},
                            title: lesson.title
                        };

                        if (lesson.dishId && typeof lesson.dishId === "string") {
                            const dishesList = {};

                            //------------------------------- supplies -------------------------------
                            suppliesCollection.find({ "dishMainId": lesson.dishId }).forEach(async (suppliesItr) => {
                                const section = suppliesItr.dishSub || "Main Dish";
                                let order = 0;
                                if (suppliesItr.dishSubId) {
                                    if (!dishesList[suppliesItr.dishSubId]) {
                                        const subDish = await dishesCollection.findOne({ dishId: suppliesItr.dishSubId });
                                        dishesList[suppliesItr.dishSubId] = subDish.order;
                                    }
                                    order = dishesList[suppliesItr.dishSubId];
                                }
                                //if the sub dish doesn't exists, create the list for gear / ingredients
                                lessonDoc.gear[order] = lessonDoc.gear[order] || { sectionName: section, items: {} };
                                lessonDoc.ingredients[order] = lessonDoc.ingredients[order] || { sectionName: section, items: {} };

                                const supplyObj = {
                                    name: suppliesItr.name,
                                    quantity: suppliesItr.quantity,
                                    unit: suppliesItr.unit
                                }

                                if (suppliesItr.type === "Ingredient") {
                                    lessonDoc.ingredients[order].items[suppliesItr.supplyId] = supplyObj;
                                } else {
                                    lessonDoc.gear[order].items[suppliesItr.supplyId] = supplyObj;
                                }
                            });

                            // ------------------------------------ supplies End
                            // ------------------------------------ shorthand
                            shorthandCollection.find({ "dishMainId": lesson.dishId }).forEach(async (shorthand) => {
                                const section = shorthand.sectionTitle || "Main Dish";
                                const order = shorthand.sectionNum || 0;

                                //if the sub dish doesn't exists, create the list for gear / ingredients
                                lessonDoc.shorthand[order] = lessonDoc.shorthand[order] || { sectionName: section, items: [] };

                                const shorthandObj = {
                                    step: shorthand.name,
                                    order: shorthand.stepNum,
                                    details: shorthand.details
                                }

                                lessonDoc.shorthand[order].items[shorthand.stepNum] = shorthandObj;

                            });
                            // ------------------------------------ shorthand End


                            const dish = await dishesCollection.findOne({ dishId: lesson.dishId });
                            lessonDoc.cuisine.concat(dish.cuisine);
                            lessonDoc.description += dish.description;
                            lessonDoc.dietary.concat(dish.dietary);
                            lessonDoc.skills.concat(dish.skills);
                            lessonDoc.duration = parseInt(dish.duration);
                            lessonDoc.videoUrl = dish.videoUrl;
                            lessonDoc.times.total = parseInt(dish.totalTime);
                            lessonDoc.times.handsOn = parseInt(dish.handsOnTime);
                        }

                        Lessons.saveLesson(lessonDoc);
                        console.log(`saved lesson: ${lessonDoc.id} `);
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