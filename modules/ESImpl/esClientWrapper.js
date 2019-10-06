const { Client } = require('@elastic/elasticsearch')
const esClient = new Client({
    cloud: {
        id: 'yeschef:dXMtZWFzdC0xLmF3cy5mb3VuZC5pbyRjMTcyZjdjYjVjYjY0YzUxYjE1MWYxNGE5Nzk0ODg3ZiQ3Yzc1OWFkYzVmOGQ0Mjk5YmYzYzRjNTQ5ZTFjYWE0Mw=='
    },
    auth: {
        // apiKey: '8s1dqJAIS7KnUHdb5tfamg'
        username: "yc-be",
        password: "wV27Znc5LHGRdiq"
    }
});

exports.esClient = esClient;