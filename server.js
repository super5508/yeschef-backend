const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080
const cors = require('cors');
// const axios = require('axios');
const Chefs = require('./modules/Chefs')
const Classes = require('./modules/Classes')
const Lessons = require('./modules/Lessons')
const Users = require('./modules/Users');
const { Client } = require('@elastic/elasticsearch')
start = async () => {
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

    // Default config options
    // const defaultOptions = {
    //     baseURL: 'https://c172f7cb5cb64c51b151f14a9794887f.us-east-1.aws.found.io:9243',
    //     headers: {
    //         'Authorization': 'Basic eWMtYmU6d1YyN1puYzVMSEdSZGlx'
    //     },
    // };
    // Create instance
    // let axiosInstance = axios.create(defaultOptions);
    Chefs.init(esClient);
    Lessons.init(esClient);
    Classes.init(esClient, Lessons);

    const allowedOrigins = ['http://localhost:3000', 'https://yeschef.me'];

    // Automatically allow cross-origin requests
    app.use(cors({
        origin: (origin, callback) => {
            // allow requests with no origin 
            // (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) === -1) {
                var msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    }));
    app.use(bodyParser.json())

    //End points
    app.get('/chef/:id/info', Chefs.getInfo);

    // app.post('/checkout', Stripe.addCharge);

    app.post('/user', Users.update);
    app.get('/user', Users.getUserData);

    app.get('/class/:id', Classes.getInfo);
    app.get('/classes/', Classes.getClassList);

    // app.get('/lesson/:id', Lessons.getInfo);
    app.get('/class/:classId/lesson/:lessonIndex', Lessons.getInfoByClassAndIndex);

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

start();