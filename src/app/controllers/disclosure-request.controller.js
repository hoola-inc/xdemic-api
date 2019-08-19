const decodeJWT = require('did-jwt').decodeJWT;
const { Credentials } = require('uport-credentials');
const transports = require('uport-transports').transport;
const message = require('uport-transports').message.util;
const dotenv = require('dotenv');
dotenv.config();

const credentials = new Credentials({
    appName: 'Xdemic',
    did: 'did:ethr:0xd741a6dd2711521e8798fbe92c12fcb9d2f43cf1',
    privateKey: '8986bea04ec687c45be90c5a6e259dbf125291f3a8ede0b595442c39d3322875'
});

exports.showQRCode = (req, res, next) => {
    credentials.createDisclosureRequest({
        requested: ["name", "date_of_birth", "phone", "email"],
        notifications: true,
        callbackUrl: process.env.BASE_URL.concat('qrcode/callback')
    })
        .then(requestToken => {
            console.log(decodeJWT(requestToken));  //log request token to console
            const uri = message.paramsToQueryString(message.messageToURI(requestToken), { callback_type: 'post' });
            const qr = transports.ui.getImageDataURI(uri); // todo cahnge here with google playstore link ...
            console.log(qr);
            res.send(`<div><img src="${qr}"/></div>`);
        })
        .catch(err => {
            next(err);
        });
}

exports.varifyClaims = (req, res, next) => {
    const jwt = req.body.access_token;
    console.log(jwt);
    credentials.createVerification(jwt)
        .then(creds => {
            const push = transports.push.send(creds.pushToken, creds.boxPub)

            credentials.authenticateDisclosureResponse({
                sub: creds.did,
                exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
                claim:
                {
                    "name": "Rizwan",
                    "id": "Single",
                    "date of birth": "01/02/1990",
                    "phone_number": "0333 3333333"
                }
            })
                .then(attestation => {
                    return push(attestation)  // *push* the notification to the user's uPort mobile app.
                })
                .then(data => {
                    return res.status(200).json({
                        status: true,
                        data: data,
                        message: "Push notification sent and should be recieved any moment, Accept the push notification in the uPort mobile application"
                    })
                })
                .catch(err => {
                    next(err);
                })
        })
        .catch(err => {
            next(err);
        })
}