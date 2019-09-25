const admin = require('firebase-admin');
const UsersMongo = require('./MongoImpl/UsersMongo');

var serviceAccount = {
    "type": "service_account",
    "project_id": "yeschef-7b155",
    "private_key_id": "606b52dfa45531697a3a6b794f365ba3ba036fd0",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3V2Rc9z5O08N2\n48iordergZqK8pqQJkSlzmoc/zA8qIk6ClKhX3bKp+h37aw19qOkcv01gQ9SmvqV\nAwSBFmxUjjv90XYra9Pr+Wup10WYPx6VvPXw9wk6z5lznjAgJdk7ZyHd3ZVwBXbd\nzPQpcFYahV7sq347uxl2G9OaEP31Wlt5eBtPpLJRhPBWc9OCGtHJh+AnjKIZCDjj\nyAud5EqKxTO/hxv5MPxDiAggGu6T0trCyIrGQJzh4BpfmMsKgdrK0Os7KwKGbpid\nSkOYMb3wkwK88b3jh/XUQtUqIdlmdVaPETArStKcKe0y844fEnF6bXqZEjqPR/N6\niSRQ/ayhAgMBAAECggEAAZJOciyNXGwcwg1gSC/bSCVPf47mS8OENZ6gErkOPwrb\nyENT4323vTN0vuhq4DiJvQxeRsHhMX5SFQpmVLvuOEhS09Fij6s4MQ7dgSJu/ofV\n+YcZ3ZOkgNxMLq1FsNTaOJPg+q+eSwxE8VBDLILBvi7z+hfbOGRZasWAyhKItrxo\njke29ACIPGLLMPOgHJQmDDCmTRe7HQPArJqLjvePhgz9vQXJO65KdFQROTGdC8yK\nghdtigwPYEJutTXxMnOyN3BwuzJPzgjuvWchsqUtLu7TpCPzYe6T2FZSQeHUaeeu\nZzAPSWgJ4yP0bTE1XrbM2fBMzFkP1kx6YWWSOgjJtQKBgQDvaSNMkXG1obSeM/Qo\nQ0XRAMS/EoyLSbKuFlnrjL6DHl3849SpEfTSNRn6I5PVgZE3xZQrkpY1ggkZWfko\nGB16EZP1cImETcsO7wpQNmR60+ZC469ZSyeBfeCsmkCjnEyGqh70NUBo5BrdZ3d9\nKnqvHrq9xBigt0vdXwsTZh2WjQKBgQDEC6ad4d2owgdteuC1Sso8cWb20U+++N2a\nIm+ITp2F+h/9i5fmjpY4lcS7RLg0y87iKN5oyIbHYqlVQ8LE1QwBaqtHwi4yEnpl\n3iipxW8BqqBpRu6HvTG7IGs6z95XSr4lvjoiryReeOZbuA4YgpXoEvEtU7qDdouO\nXDn+aawjZQKBgQCE5B1d8RXnNj1l23zZpI3qd7y+OvOclWoDTBDZuSQ+7+pH58cx\nmfAFhshGmt0ClIshJCEdFp8eUHHwiorNAKXMDlnM0YzjzbK7NWDKKYcYzupvkqbQ\nr/Db5h2CcZUTvDyWO3Q3Jh/8mTF4WGhxJ9U1w57wmxr4iwYneQxS1knyOQKBgQCn\n3qofi2a4uNyPXKbJ1m7x7tESDA1TI9rtvwruFxM/w/xcqYm6vOHZNjWtfZyWaOaQ\nNhqscvkmBk+lWU6QKTYMiIB+A8J20efJDsCXDx6MuMR/IWPjC5hn+cyYIaLr8G59\n9zPku0BTPQdUBnjbeAZRINcvzwBozbuWfVaTiX0DGQKBgFNY5x6CqIxUrpBDNoli\nhcGmQYAE6p+g2GnU5vJ5zlT6ePi42DMsN3siNTSRNQDF47UrgC9qiDxA+t6jeAf3\n7dl+RJfvg30NlruJy2juB7E+20nzDPhVOJjZFL0d4NCRxI5VTwglex/MCxHy6zQt\nCwFTza0mA+BEoJrg5JxpmuIa\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-2whvt@yeschef-7b155.iam.gserviceaccount.com",
    "client_id": "101763017722239239477",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2whvt%40yeschef-7b155.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://yeschef-7b155.firebaseio.com/"
});

const isAdmin = async (req) => {
    const authToken = req.headers.authtoken;
    if (!authToken) return false;
    const decodedToken = await admin.auth().verifyIdToken(authToken);
    const executingUser = await UsersMongo.getUserDataMongo(decodedToken.user_id);
    return executingUser.isAdmin;
}

module.exports = { admin, isAdmin };