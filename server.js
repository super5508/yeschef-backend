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
const Feedback = require('./modules/Feedbacks');
const Beta = require('./modules/Beta');
const UserWatching = require('./modules/UserWatching');

start = async () => {

    // Default config options
    // const defaultOptions = {
    //     baseURL: 'https://c172f7cb5cb64c51b151f14a9794887f.us-east-1.aws.found.io:9243',
    //     headers: {
    //         'Authorization': 'Basic eWMtYmU6d1YyN1puYzVMSEdSZGlx'
    //     },
    // };
    // Create instance
    // let axiosInstance = axios.create(defaultOptions);
    const adminOrigins = ['http://localhost:3001', 'https://production.di5rch2vp2n9y.amplifyapp.com', 'https://master.di5rch2vp2n9y.amplifyapp.com'];
    const webAppOrigins = ['http://localhost:3000', 'https://staging.app.yeschef.me', 'https://app.yeschef.me'];

    const allowedOrigins = ['https://yeschef.me'].concat(adminOrigins, webAppOrigins);

    // Automatically allow cross-origin requests
    app.use(cors({
        optionsSuccessStatus: 200,
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

    app.options('*', cors());

    app.use(bodyParser.json({ limit: '50mb' }));

    //todo : check if we can remove this section
    app.use(function (req, res, next) {
        //res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        //intercepts OPTIONS method
        if ('OPTIONS' === req.method) {
            console.log("response to OPTION");
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

    app.post('/feedback', Feedback.addFeedback);
    app.get('/feedback', Feedback.getFeedback);
    app.get('/history/:user', UserWatching.getWatchingData);
    app.post('/history', UserWatching.updateWatchingData);

    app.get('/hc', (req, res) => {
        res.end("I'm Alive!");
    });

    app.get('/class/:id', Classes.getInfo);
    app.get('/classes/', Classes.getClassList);
    app.get('/class/:classId/lesson/:lessonIndex', Lessons.getInfoByClassAndIndex);

    app.post('/docs/', Admin.adminDocsUpdate);
    app.post('/docs/generate/', Admin.adminDocsGenerate);

    //-------------------------------------------------admin-----------------------
    app.get('/user/:email', Admin.adminGetUser);
    app.post('/user/:email', Admin.adminUpdateUser);

    app.get('/beta', Beta.getNewsData);
    app.post('/addbeta', Beta.addNewsBeta);
    app.post('/updateData', Beta.updateData)

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
start();