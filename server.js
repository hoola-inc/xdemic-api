'use strict'

const express = require('express');
const compression = require('compression');
const chalk = require('chalk');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const app = express();
// const winston = require('./src/config/winston-stream.config');
const cool = require('cool-ascii-faces');
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
    return res.status(200).json({ message: "Welcome to XdemiC api ", cheers: cool() });
});






const webPush = require('web-push');

// console.log(webPush.generateVAPIDKeys());

webPush.setGCMAPIKey(process.env.GOOGLE_API_KEY);
webPush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);


app.post('/notifications/subscribe', (req, res) => {
    const subscription = req.body

    console.log(subscription);
    writeToFile(subscription);
    const payload = JSON.stringify({
        title: 'Hello!',
        body: 'It works.',
    });

    webPush.sendNotification(subscription, payload)
        .then(result => console.log(result))
        .catch(e => console.log(e.stack))

    res.status(200).json({ 'success': true })
});


function writeToFile(subscription) {
    const fs = require('fs');

    fs.writeFile("./not.json", subscription, function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}






// {
//     endpoint:
//     'https://updates.push.services.mozilla.com/wpush/v2/gAAAAABd249wh7rfOTglYzVGHMzAk2qE6Nao3bACnM5By1UrOC64EiI_4utk6h1kR27jBhL5xwCIsbXCq166mFYbgTPIbfFUCvRfoo2JQPDhZqTb0-SvoHiFbiMawtRSBFzPx93TrumlBIBI-27KsZ1k3hjTS8BDlTQ2xubDtd8HAhDZvDCxP_c',
//         keys:
//     {
//         auth: '6PVEAGywLutDohCaEws1gQ',
//             p256dh:
//         'BBSFkOVI4qnHRybxYabyBfH3SE6BTBH4Z_loBpN-NoOTtYyTzBjHqSPkgrYYauPgmSCwsT5tu8DSCFf_C4lAaRE'
//     }
// }
// POST / notifications / subscribe 200 9.094 ms - 16
// {
//     statusCode: 201,
//         body: '',
//             headers:
//     {
//         'access-control-allow-headers':
//         'content-encoding,encryption,crypto-key,ttl,encryption-key,content-type,authorization',
//             'access-control-allow-methods': 'POST',
//                 'access-control-allow-origin': '*',
//                     'access-control-expose-headers': 'location,www-authenticate',
//                         'content-type': 'text/html; charset=UTF-8',
//                             date: 'Mon, 25 Nov 2019 08:23:12 GMT',
//                                 location:
//         'https://updates.push.services.mozilla.com/m/gAAAAABd249wnf2tYCqrc_sAnCf5e1SrjwyfcAL0f8q9uEbrwo_MWLDvmePN7HmOoACag3ptKMkhf6ege_KMvOcmmgzQmw29aAf9xIAM-B4cvMadAxHZrahcAHV3PDSLqiigjCl6YdmstRGXKZKx-D19ckCDgYIemphuWZ63LriHe96Ab4k4t5c0OED32aU6-7l-ugZGpciU',
//             server: 'nginx',
//                 'strict-transport-security': 'max-age=31536000;includeSubDomains',
//                     ttl: '2419200',
//                         2019 - 11 - 25T08: 23: 12.918066 + 00: 00 app[web.1]: 'content-length': '0',
//                             connection: 'Close'
//     }
// }



































const publicDir = require('path').join(__dirname, './public');
// console.log(publicDir);
app.use(express.static(publicDir));


// import all routes at once
require('./src/utilities/routes.utility')(app);

// Handling non-existing routes
// Handling non-existing routes
require('./src/utilities/response-handler.utility')(app);

// db config
require('./src/config/db.config');



const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`%s 🚀 Server is listening on port ${port}`, chalk.green('✓')));
