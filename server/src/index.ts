const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const OAuthServer = require('express-oauth-server');

const memoryStore = require('./model');

const app = express();
const port = 3000;

// See https://github.com/oauthjs/node-oauth2-server for specification
app.oauth = new OAuthServer({
    model: memoryStore,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev', {}));
// app.use(app.oauth.authorize());

// app.all('/oauth/token', app.oauth.grant());

// app.use(function(req, res) {
//     res.send('Secret area');
// });

app.get('/', app.oauth.authorize(), function(req, res) {
    res.send('Secret area');
});

app.listen(port);
app.on('error', onError);
app.on('listening', onListening);

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    const addr = app.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log(`Server is listening on ${bind}`);
}
