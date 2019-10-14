const { esClient } = require('./ESImpl/esClientWrapper');
const LessonsModule = require('./Lessons');

// exports.init = (_esClient, _lessonsModule) => {
//     esClient = _esClient;
//     LessonsModule = _lessonsModule;
// }

exports.saveClass = async (classObj) => {
    let response = false;
    try {
        await esClient.update({
            index: "classes",
            id: classObj.id,
            doc_as_upsert: true,
            body: { doc: classObj }
        })
        response = true;
    } catch (e) {
        const errMsg = "error in saving class";
        console.warn(errMsg);
        console.warn(e);
    }
    return response;
}

exports.getClassList = async (req, res) => {
    res.set("Cache-Control", "max-age=600");
    let response;
    try {
        const classesResponse = await esClient.search({
            index: "classes",
            size: 500,
            body: {
                "query": {
                    "bool": {
                        "must": {
                            "term": { "isStaging": false }
                        }
                    }
                }
            }
        })

        const classesArray = classesResponse.body.hits.hits;
        response = JSON.stringify(classesArray.map(_class => {
            const { chefName, classTitle, chefImg, comingSoon } = _class._source;
            return {
                id: _class._id,
                chefName,
                classTitle,
                chefImg,
                comingSoon: comingSoon || false
            }
        }));
        console.log(response);
    } catch (e) {
        const errMsg = "error in getting class List data";
        console.warn(errMsg);
        console.warn(e);
        response = errMsg;
        res.status(500)
    }
    res.send(response);
}

exports.getInfo = async (req, res) => {
    res.set("Cache-Control", "max-age=600");
    let response;
    try {
        const getClassResponse = await esClient.get({
            index: 'classes',
            id: req.params.id
        });

        const classInfoObj = getClassResponse.body._source;
        const lessonsList = await LessonsModule.getLiteLessonsByIdList(classInfoObj.lessons);

        response = JSON.stringify({ ...classInfoObj, lessons: lessonsList });
    } catch (e) {
        const errMsg = "error in getting class's data";
        console.warn(errMsg);
        console.warn(e);
        response = errMsg;
        res.status(500)
    }
    res.send(response);
}