const decodeJWT = require('did-jwt').decodeJWT;
const { Credentials } = require('uport-credentials');
const transports = require('uport-transports').transport;
const message = require('uport-transports').message.util;
const StudentSchema = require('../models/student.model');
const notification = require('../../utilities/notification.utility');

const pushToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1Njc1ODAzMjYsImV4cCI6MTU5OTExNjMyNiwiYXVkIjoiZGlkOmV0aHI6MHhkNzQxYTZkZDI3MTE1MjFlODc5OGZiZTkyYzEyZmNiOWQyZjQzY2YxIiwidHlwZSI6Im5vdGlmaWNhdGlvbnMiLCJ2YWx1ZSI6ImFybjphd3M6c25zOnVzLXdlc3QtMjoxMTMxOTYyMTY1NTg6ZW5kcG9pbnQvR0NNL3VQb3J0Lzc0Njk2YTE4LTE2ODctMzBiYy1hYzI3LWY1M2ViMTE0OTZiMCIsImlzcyI6ImRpZDpldGhyOjB4YTA1NmZmYmZkNjQ0ZTQ4MmFkOGQ3MjJjNGJlNGM2NmFhMDUyYWQ1YSJ9.dXjd2xOOpqjdbBip1qtuHyTuAXfqlmZjLVdyap09U1ntlq8Z84sx3STcxMlIhA2I3yetCdJGxYfyb3A84UbVtQA'

const credentials = new Credentials({
    appName: 'Xdemic',
    did: 'did:ethr:0xd741a6dd2711521e8798fbe92c12fcb9d2f43cf1',
    privateKey: '8986bea04ec687c45be90c5a6e259dbf125291f3a8ede0b595442c39d3322875'
});

exports.showQRCode = (req, res, next) => {
    credentials.createDisclosureRequest({
        requested: ["name", "dob", "phone", "email"],
        notifications: true,
        callbackUrl: process.env.BASE_URL.concat('callback'),
        callback_url: process.env.BASE_URL.concat('callback')
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

    const jwt = req.body.access_token
    credentials.authenticateDisclosureResponse(jwt).then(creds => {
        // take this time to perform custom authorization steps... then,
        // set up a push transport with the provided 
        // push token and public encryption key (boxPub)
        const push = transports.push.send(creds.pushToken, creds.boxPub);
        const newStudent = new StudentSchema(creds);
        newStudent.save()
            .then(data => {
                console.log('student created');
                createVerification(creds, push, next);
            })
            .catch(err => {
                console.log('An error occured: ', err.message)
            })

    })
}

function createVerification(creds, push, next) {
    credentials.createVerification({
        sub: creds.did,
        exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
        claim: { 'name': creds.name, 'dob': creds.dob, 'phone': creds.phone, 'email': creds.email }
        // Note, the above is a complex (nested) claim. 
        // Also supported are simple claims:  claim: {'Key' : 'Value'}
    }).then(attestation => {
        console.log(`Encoded JWT sent to user: ${attestation}`);
        console.log(`Decodeded JWT sent to user: ${JSON.stringify(decodeJWT(attestation))}`);
        return push(attestation); // *push* the notification to the user's mobile app.
    }).then(res => {
        notification.sendNotification({
            "endpoint": "https://updates.push.services.mozilla.com:443/wpush/v1/<some_id>",
            "keys": {
                "auth": "<some key>",
                "p256dh": "<some key>"
            }
        });
        console.log(res);
        console.log('Push notification sent and should be recieved any moment...');
        console.log('Accept the push notification in the xdemic mobile application');
    })
        .catch(err => {
            console.log(err);
            next(err.message);
        });
}

exports.sendNotification = (req, res, next) => {
    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: 'test' });

    console.log(subscription);

    webpush.sendNotification(subscription, payload).catch(error => {
        console.error(error.stack);
        next(err.message);
    });
}
