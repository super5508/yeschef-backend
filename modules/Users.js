const { admin, isAdmin } = require('./FBAdmin').admin;
const UsersMongo = require('./MongoImpl/UsersMongo');

const updateUserData = (uid, data) => {
    try {
        let id = uid;
        console.log('updating the user doc id=' + id)
        admin.database().ref('/users/' + id).update(data);
    } catch (e) {
        console.log("error in updating user data");
        console.log(e);
    }
}

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

const update = async (req, res) => {
    const body = req.body;
    const tokenId = body.authToken
    const decodedToken = await admin.auth().verifyIdToken(tokenId);

    UsersMongo.updateUserDataMongo(decodedToken.user_id, body);
    res.send('');
}

const getUserData = async (req, res) => {
    const decodedToken = await admin.auth().verifyIdToken(req.header('authToken'));
    const id = decodedToken.user_id;
    console.log('Going to get user data for userId ' + id)

    const snapshot = await UsersMongo.getUserDataMongo(id);
    //const snapshot = (await admin.database().ref('/users/' + id).once('value')).val();
    res.end(JSON.stringify(snapshot));
}

module.exports = {
    update,
    updateUserData,
    getUserData,
    adminUpdateUser,
    adminGetUser
}