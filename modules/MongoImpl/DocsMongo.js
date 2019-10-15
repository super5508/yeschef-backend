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
            const contentBlocksCollection = client.db("runtime").collection("contentBlocks");
            const suppliesCollection = client.db("runtime").collection("supplies");
            const shorthandCollection = client.db("runtime").collection("shorthand");
            // perform actions on the collection object
            await classesCollection.find().forEach(async (classItr) => {
                const chefId = classItr.chefId;
                let chef = await client.db("runtime").collection("chefs").findOne({ chefId });
                chef = chef || {
                    bio: "",
                    fbUrl: "",
                    igUrl: "",
                    twUrl: ""
                };

                Classes.saveClass({
                    id: classItr.classId,
                    about: chef.bio,
                    chefImg: classItr.photo,
                    description: classItr.description,
                    lessons: classItr.lessonsId.sort ? classItr.lessonsId.sort() : [classItr.lessonId],
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
                    if (typeof classItr.lessonsId === "string") {
                        classItr.lessonsId = [classItr.lessonsId];
                    }
                    for (const lessonId of classItr.lessonsId) {
                        const lesson = await lessonsCollection.findOne({ lessonId });
                        const lessonDoc = {
                            id: lessonId,
                            thumbnail: lesson.thumbnail,
                            cuisine: [],
                            description: "",
                            dietary: [],
                            duration: 1000,
                            supplies: [],
                            shorthand: [],
                            skills: [],
                            times: {},
                            title: lesson.title
                        };

                        if (lesson.contentBlockId && typeof lesson.contentBlockId === "string") {
                            const contentBlocksList = {};

                            //------------------------------- supplies -------------------------------
                            await suppliesCollection.find({ "contentBlockMainId": lesson.contentBlockId }).forEach(async (suppliesItr) => {
                                const section = suppliesItr.contentBlockSub || "Main Dish";
                                let order = 0;
                                if (suppliesItr.contentBlockSubId) {
                                    if (!contentBlocksList[suppliesItr.contentBlockSubId]) {
                                        const subContentBlock = await contentBlocksCollection.findOne({ contentBlockId: suppliesItr.contentBlockSubId });
                                        contentBlocksList[suppliesItr.contentBlockSubId] = subContentBlock.order || 0;
                                    }
                                    order = contentBlocksList[suppliesItr.contentBlockSubId];
                                }
                                //if the sub dish doesn't exists, create the list for gear / ingredients
                                lessonDoc.supplies[order] = lessonDoc.supplies[order] || {
                                    sectionName: section,
                                    gear: [],
                                    ingredients: []
                                }

                                const supplyObj = {
                                    id: suppliesItr.supplyId,
                                    name: suppliesItr.name,
                                    quantity: suppliesItr.quantity,
                                    unit: suppliesItr.unit,
                                    details: suppliesItr.details
                                }

                                if (suppliesItr.type === "Ingredient") {
                                    lessonDoc.supplies[order].ingredients.push(supplyObj);
                                } else {
                                    lessonDoc.supplies[order].gear.push(supplyObj);
                                }
                            });

                            // ------------------------------------ supplies End
                            // ------------------------------------ shorthand
                            await shorthandCollection.find({ "contentBlockMainId": lesson.contentBlockId }).forEach(async (shorthand) => {
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


                            const contentBlock = await contentBlocksCollection.findOne({ contentBlockId: lesson.contentBlockId });
                            lessonDoc.cuisine.concat(contentBlock.cuisine);
                            lessonDoc.description += contentBlock.description;
                            lessonDoc.dietary.concat(contentBlock.dietary);
                            lessonDoc.skills.concat(contentBlock.skills);
                            lessonDoc.duration = parseInt(contentBlock.duration) || 0;
                            lessonDoc.videoUrl = contentBlock.videoUrl;
                            lessonDoc.vimeoUrl = contentBlock.vimeoUrl;
                            lessonDoc.times.total = parseInt(contentBlock.totalTime);
                            lessonDoc.times.handsOn = parseInt(contentBlock.handsOnTime);
                        }

                        const saveLessonResponse = await Lessons.saveLesson(lessonDoc);
                        if (saveLessonResponse) {
                            reject(saveLessonResponse);
                        }
                        console.log(`saved lesson: ${lessonDoc.id} `);
                    }
                }
            })
            resolve('done');
            console.log("done generating");
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