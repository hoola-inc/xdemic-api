const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');


// Create Express App
const app = express();

// providing a Connect/Express middleware that can be used to enable CORS with various options.
app.use(cors());

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: true }));

// Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help! 
// DOC: https://helmetjs.github.io/
app.use(helmet());

// HTTP request logger middleware
app.use(morgan('dev'));

// import all routes at once
// require('./src/utilities/routes.utility')(app);


// define a default route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to XdemiC api" });
});


// server listen for requests
let port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server is listening on port " + port);
});