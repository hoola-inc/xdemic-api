const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const env = require('dotenv');
// swagger 

// const winston = require('./src/config/logger.config');


// Create Express App
const app = express();


// const subpath = express();

// app.use("/v1", subpath);
// const swagger = require('swagger-node-express').createNew(subpath);
// app.use(express.static('./swagger-ui/dist'));

// swagger.setApiInfo({
//     title: "Xdemic API",
//     description: "API to do something, manage something...",
//     termsOfServiceUrl: "",
//     contact: "yourname@something.com",
//     license: "",
//     licenseUrl: ""
// });

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + './dist/index.html');
// });
// // Set api-doc path

// // swagger.configureSwaggerPaths('', 'api-docs', '');

// // config api domain
// const domain = 'localhost';

// // Configure the API port
// var portt = 9090;

// // Set and display the application URL
// var applicationUrl = 'http://' + domain + ':' + portt;
// console.log('snapJob API running on ' + applicationUrl);


// swagger.configure(applicationUrl, '1.0.0');


// // Start the web server
// app.listen(portt);






// init env var
env.config();

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
require('./src/utilities/error-handler.utility')(app);

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