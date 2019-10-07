const production = {
    "mongo": {
        "url": "mongodb+srv://yc-be:LHxTBQ6xWfWq4PL@yeschef-users-jjwej.mongodb.net/test?retryWrites=true&w=majority"
    }
};
const development = {
    "mongo": {
        "url": "mongodb+srv://yc-be-dev:W26Fbq9G2Xq92dH@dev-nppzv.mongodb.net/test?retryWrites=true&w=majority"
    }
}

module.exports = {
    production,
    development
}