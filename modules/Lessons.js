const { esClient } = require('./ESImpl/esClientWrapper');

// exports.init = (_esClient) => {
//     esClient = _esClient;
// }

exports.getLiteLessonsByIdList = async (lessonIdsList) => {
    const docs = lessonIdsList.map(lessonId => {
        return {
            _index: "lessons",
            _type: "_doc",
            _id: lessonId
        }
    });
    try {
        const getLessonResponse = await esClient.mget({
            body: {
                docs
            }
        });
        response = getLessonResponse.body.docs.map(lessonObj => {
            return lessonObj._source;
        });
    } catch (e) {
        const errMsg = "error in getting lessons data by list of ids";
        console.warn(errMsg);
        console.warn(e);
        response = [];
    }
    return response;
}

exports.saveLesson = async (lessonObj) => {
    let response = "";
    try {
        await esClient.update({
            index: "lessons",
            id: lessonObj.id,
            doc_as_upsert: true,
            body: { doc: lessonObj }
        });
    } catch (e) {
        const errMsg = "error in saving lesson";
        console.warn(errMsg);
        console.warn(e);
        response = errMsg;
    }
    return response;
}


exports.getInfoByClassAndIndex = async (req, res) => {
    res.set("Cache-Control", "max-age=600");
    try {
        //get class Data
        const getClassResponse = await esClient.get({
            index: 'classes',
            id: req.params.classId
        });

        const classInfoObj = getClassResponse.body._source;
        const lessonId = classInfoObj.lessons[parseInt(req.params.lessonIndex) - 1];

        const getLessonResponse = await esClient.get({
            index: 'lessons',
            id: lessonId
        });
        response = JSON.stringify(getLessonResponse.body._source);
    } catch (e) {
        const errMsg = "error in getting lesson's data by class and index";
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