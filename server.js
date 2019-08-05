const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const ngrok = require('ngrok');
// const winston = require('./src/config/logger.config');


// Create Express App
const app = express();

// providing a Connect/Express middleware that can be used to enable CORS with various options.
app.use(cors());

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help! 
// DOC: https://helmetjs.github.io/
app.use(helmet());

// HTTP request logger middleware
app.use(morgan('dev'));

// setup the winston stream 
// app.use(morgan("combined", {
//     stream: winston.stream
// }));

// import all routes at once
require('./src/utilities/routes.utility')(app);

// logger 
// require('./src/config/logger.config');

// if invalid route found
// require('./src/utilities/route-handler.utility')(app);

require('./src/config/db.config');

// default route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to XdemiC api" });
});

// server listen for requests
// server listen for requests
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});


// app.listen(port, () => {
//     ngrok.connect(8088).then(ngrokUrl => {
//         console.log('server is running');

//         endpoint = ngrokUrl
//         console.log(`Verification Service running, open at ${endpoint}`)
//     })
// })