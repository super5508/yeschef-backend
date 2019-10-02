const { admin, isAdmin } = require('./FBAdmin');
const WatchingMongo = require('./MongoImpl/WatchingMongo');

const updateWatchingData = (uid, data) => {
    try {
        let id = uid;
        console.log('updating the user doc id=' + id)
        admin.database().ref('/users/' + id).update(data);
    } catch (e) {
        console.log("error in updating user data");
        console.log(e);
    }
}

const adminUpdateWatching = async (req, res) => {
    const body = req.body;
    if (isAdmin(body.authToken)) {
        const userRecord = await admin.auth().getUserByEmail(req.params.email);
        const id = userRecord.uid;
        WatchingMongo.updateWatchingDataMongo(id, body.data);
        res.send('');
    } else {
        res.status(401).end();
    }
}

const adminGetWatching = async (req, res) => {
    const body = req.body;
    if (isAdmin(body.authToken)) {
        const userRecord = await admin.auth().getUserByEmail(req.params.email);
        const id = userRecord.uid;
        const user = await WatchingMongo.getWatchingDataMongo(id);
        res.end(JSON.stringify(user));
    } else {
        res.status(401).end();
    }
}

const update = async (req, res) => {
    const body = req.body;
    const tokenId = body.authToken
    const decodedToken = await admin.auth().verifyIdToken(tokenId);

    WatchingMongo.updateWatchingDataMongo(decodedToken.user_id, body);
    res.send('');
}

const getWatchingData = async (req, res) => {
    const decodedToken = await admin.auth().verifyIdToken(req.header('authToken'));
    const id = decodedToken.user_id;
    console.log('Going to get user data for userId ' + id)

    const snapshot = await WatchingMongo.getWatchingDataMongo(id);
    //const snapshot = (await admin.database().ref('/users/' + id).once('value')).val();
    res.end(JSON.stringify(snapshot));
}

module.exports = {
    update,
    updateWatchingData,
    getWatchingData,
    adminUpdateWatching,
    adminGetWatching
}