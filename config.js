const production = {
    "mongo": {
        "url": "mongodb+srv://yc-be:LHxTBQ6xWfWq4PL@yeschef-users-jjwej.mongodb.net/test?retryWrites=true&w=majority"
    },
    "es": {
        cloud: {
            id: 'yeschef:dXMtZWFzdC0xLmF3cy5mb3VuZC5pbyRjMTcyZjdjYjVjYjY0YzUxYjE1MWYxNGE5Nzk0ODg3ZiQ3Yzc1OWFkYzVmOGQ0Mjk5YmYzYzRjNTQ5ZTFjYWE0Mw=='
        },
        auth: {
            // apiKey: '8s1dqJAIS7KnUHdb5tfamg'
            username: "yc-be",
            password: "wV27Znc5LHGRdiq"
        }
    }
};
const development = {
    "mongo": {
        "url": "mongodb+srv://yc-be-dev:W26Fbq9G2Xq92dH@dev-nppzv.mongodb.net/test?retryWrites=true&w=majority"
    },
    "es": {
        cloud: {
            id: 'yeschef-dev:dXMtZWFzdC0xLmF3cy5mb3VuZC5pbyRiYzAxNjdhNTU3NTM0NTY5OGRiOGExYTg3ZWI0ZWI0YyQ4NTAzZDViNDU2Zjg0MDc1OGQ1NWY5MGVkOGZmYTVjMQ=='
        },
        auth: {
            // apiKey: '8s1dqJAIS7KnUHdb5tfamg'
            username: "yc-be-dev",
            password: "LnWJpBE4sCrYrQX"
        }
    }
}

module.exports = {
    production,
    development
}