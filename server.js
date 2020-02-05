
const express = require('express');
const compression = require('compression');
const chalk = require('chalk');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const socket = require('socket.io');    
const app = express();
const server = require('http').createServer(app)
const io = socket.listen(server);
global.io = io;
// const winston = require('./src/config/winston-stream.config');
const cool = require('cool-ascii-faces');
const OAuthServer = require('express-oauth-server');
const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
require('./src/utilities/create-dir.utils');
require('dotenv').config();


// providing a Connect/Express middleware that can be used to enable CORS with various options.
app.use(cors());
app.use(compression());

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help! 
// DOC: https://helmetjs.github.io/
app.use(helmet());

// HTTP request logger middleware
app.use(morgan('dev'));
// app.use(morgan('combined', { stream: winston.stream }));

// default api route
app.get("/", (req, res, next) => {
    return res.status(200).json({ status: true, message: "Welcome to xDemiC api aws testing", cheers: cool() });
});

const publicDir = require('path').join(__dirname, './public');
// console.log(publicDir);
app.use(express.static(publicDir));

// import all routes at once
require('./src/utilities/routes.utility')(app);

// Handling non-existing routes
// Handling non-existing routes
require('./src/utilities/error-handler.utility')(app);

// db config
require('./src/config/db.config');

const port = process.env.PORT || 5500;
server.listen(port, () => console.log(`%s 🚀 Server is listening on port ${port}`, chalk.green('✓')));

// socket io connection 
let interval;
io.on("connection", socket => {
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
});
