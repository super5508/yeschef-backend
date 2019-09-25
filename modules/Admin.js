const { admin, isAdmin } = require('./FBAdmin');
const UsersMongo = require('./MongoImpl/UsersMongo');
const docsMongo = require('./MongoImpl/DocsMongo');

const adminUpdateUser = async (req, res) => {
    const body = req.body;
    if (isAdmin(body.authToken)) {
        const userRecord = await admin.auth().getUserByEmail(req.params.email);
        const id = userRecord.uid;
        UsersMongo.updateUserDataMongo(id, body.data);
        res.send('');
    } else {
        res.status(401).end();
    }
}

const adminGetUser = async (req, res) => {
    const body = req.body;
    if (isAdmin(body.authToken)) {
        const userRecord = await admin.auth().getUserByEmail(req.params.email);
        const id = userRecord.uid;
        const user = await UsersMongo.getUserDataMongo(id);
        res.end(JSON.stringify(user));
    } else {
        res.status(401).end();
    }
}

const adminDocsUpdate = async (req, res) => {
    const body = req.body;
    // if (isAdmin(body.authToken)) {
    const result = await docsMongo.replaceDocsMongo(body.db, body.collection, body.docIdKey, body.data);
    res.end(result);
    // } else {
    //     res.status(401).end();
    // }

}

module.exports = {
    adminUpdateUser,
    adminGetUser,
    adminDocsUpdate
}