const { admin, isAdmin } = require('./FBAdmin');
const UsersMongo = require('./MongoImpl/UsersMongo');
const docsMongo = require('./MongoImpl/DocsMongo');

const adminUpdateUser = async (req, res) => {
    const body = req.body;
    if (await isAdmin(req)) {
        const userRecord = await admin.auth().getUserByEmail(req.params.email);
        const id = userRecord.uid;
        UsersMongo.updateUserDataMongo(id, body.data);
        res.send('');
    } else {
        res.status(401).end();
    }
}

const adminGetUser = async (req, res) => {
    try {
        const body = req.body;
        if (await isAdmin(req)) {

            const userRecord = await admin.auth().getUserByEmail(req.params.email);

            const id = userRecord.uid;
            const user = await UsersMongo.getUserDataMongo(id);
            res.end(JSON.stringify(user));
        } else {
            res.status(401).end();
        }
    } catch (err) {
        console.log(err);
        if (err && err.code && err.code === "auth/user-not-found") {
            res.status(404).end("user not found");
        }
    }
}

const adminDocsUpdate = async (req, res) => {
    const body = req.body;
    console.log('check if user is admin');
    if (await isAdmin(req)) {
        const result = await docsMongo.replaceDocsMongo(body.db, body.collection, body.docIdKey, body.data);
        res.end(result);
    } else {
        res.status(401).end();
    }

}

module.exports = {
    adminUpdateUser,
    adminGetUser,
    adminDocsUpdate
}