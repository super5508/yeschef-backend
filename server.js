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
const Admin = require('./modules/Admin');

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

    const allowedOrigins = ['http://localhost:3000', 'https://yeschef.me', 'https://master.d3stwmnjf2nisj.amplifyapp.com'];

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
    app.use(bodyParser.json());

    app.use(function (req, res, next) {
        //res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        //intercepts OPTIONS method
        if ('OPTIONS' === req.method) {
            //respond with 200
            res.send(200);
        }
        else {
            //move on
            next();
        }
    });

    //End points
    app.get('/chef/:id/info', Chefs.getInfo);

    // app.post('/checkout', Stripe.addCharge);

    app.post('/user', Users.update);
    app.get('/user', Users.getUserData);

    app.get('/hc', (req, res) => {
        res.end("I'm Alive!");
    });

    app.get('/class/:id', Classes.getInfo);
    app.get('/classes/', Classes.getClassList);
    app.get('/class/:classId/lesson/:lessonIndex', Lessons.getInfoByClassAndIndex);

    app.post('/docs/', Admin.adminDocsUpdate);

    //-------------------------------------------------admin-----------------------
    app.get('/user/:email', Admin.adminGetUser);
    app.post('/user/:email', Admin.adminUpdateUser);

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
start();