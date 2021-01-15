// load environment variables
require('dotenv').config();

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import * as OAuthServer from 'express-oauth-server';

import {OAuthModel} from './modules/oauth/model';
import {OAuthClient} from './modules/oauth/oauth-client.model';
import {User} from './modules/user/user.model';
// User.find({});

const app = express();
const port = process.env.HTTPS_PORT;

// configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev', {}));

// connect to database
connectDb();

// configure OAuth extension
let oauth = new OAuthServer({
    model: OAuthModel,
    debug: true
});

const router = express.Router();

router.post('/auth/access_token', oauth.token({
    requireClientAuthentication: {
        authorization_code: false,
        refresh_token: false
    }
}));

// router.get('/auth/authenticate', async (req, res, next) => {
//     return res.render('authenticate')
// });

router.post('/auth/authenticate', async (req, res, next) => {
    req.body.user = await User.findOne({ username: req.body.username });
    return next();
}, oauth.authorize({
    authenticateHandler: {
        handle: req => {
            return req.body.user;
        }
    }
}));

router.post('/users/register', async (req, res, next) => {

    // create user
    const _user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        verificationCode: crypto.randomBytes(16).toString('hex'),
    });
    (_user as any).setPassword(req.body.password);

    let user = null;
    try {
        user = await _user.save();
    } catch (error) {
        return res.status(422).send(error.errmsg);
    }

    if (!user)
        return res.status(422).send('Error creating user');

    // create OAuth Client
    let _client = await OAuthModel.getClient(
        req.body.clientId,
        req.body.clientSecret
    );

    if (!_client) {
        _client = new OAuthClient({
            user: user.id,
            clientId: req.body.clientId,
            clientSecret: req.body.clientSecret,
            redirectUris: req.body.redirectUris.split(','),
            grants: ['authorization_code', 'client_credentials', 'refresh_token', 'password']
        });
        _client.save();
    }

    return res.redirect('/');

});

router.get('/', (req, res, next) => {
    res.send('welcome c:');
});

app.use(router);

app.listen(port);
// app.on('error', onError);
// app.on('listening', onListening);
//
// function onError(error: NodeJS.ErrnoException): void {
//     if (error.syscall !== 'listen') throw error;
//     const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
//     switch (error.code) {
//         case 'EACCES':
//             console.error(`${bind} requires elevated privileges`);
//             process.exit(1);
//             break;
//         case 'EADDRINUSE':
//             console.error(`${bind} is already in use`);
//             process.exit(1);
//             break;
//         default:
//             throw error;
//     }
// }
//
// function onListening(): void {
//     const addr = app.address();
//     const bind = typeof addr === 'string'
//         ? 'pipe ' + addr
//         : 'port ' + addr.port;
//     console.log(`Server is listening on ${bind}`);
// }

function connectDb(): void {
    let url;
    url = `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
    mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
    mongoose.set('debug', true);
    mongoose.set('useCreateIndex', true);

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('Connection to DB server established');
    });
}
