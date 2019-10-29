const decodeJWT = require('did-jwt').decodeJWT;
const { Credentials } = require('uport-credentials');
const transports = require('uport-transports').transport;
const message = require('uport-transports').message.util;
const StudentSchema = require('../models/student.model');
const schoolSchema = require('../models/school.model');

const credentials = new Credentials({
    appName: 'Xdemic',
    did: 'did:ethr:0xd741a6dd2711521e8798fbe92c12fcb9d2f43cf1',
    privateKey: '8986bea04ec687c45be90c5a6e259dbf125291f3a8ede0b595442c39d3322875'
});

exports.showQRCode = async (req, res, next) => {
    try {
        const requestToken = await credentials.createDisclosureRequest({
            requested: ["fullName", "givenName", "familyName", "email", "mobile", "birthDate"],
            notifications: true,
            callbackUrl: process.env.BASE_URL.concat('callback'),
            callback_url: process.env.BASE_URL.concat('callback')
        });

        if (requestToken) {
            console.log(decodeJWT(requestToken));  //log request token to console
            const uri = message.paramsToQueryString(message.messageToURI(requestToken), { callback_type: 'post' });
            const qr = transports.ui.getImageDataURI(uri); // todo cahnge here with google playstore link ...
            console.log(qr);
            res.send(`<div><img src="${qr}"/></div>`);
        }
    } catch (error) {
        next(error);
    }
};

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
                updateStudnetArrayInSchool(data)
                    .then(updatedStudent => {
                        console.log('Student Updated ::: ', updatedStudent)
                        createVerification(creds, push, next);
                    })
                    .catch(err => {
                        console.log(err.message);
                    });
            })
            .catch(err => {
                console.log('An error occured: ', err.message);
                next(err.message);
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
        console.log(res);
        console.log('Push notification sent and should be recieved any moment...');
        console.log('Accept the push notification in the xdemic mobile application');
        sendNotification(creds);
    })
        .catch(err => {
            console.log(err);
            next(err.message);
        });
}




function sendNotification(creds) {

    const io = require('../../../server').io;
    console.log('sending push notification using socket io');
    let interval;
    io.on("connection", socket => {
        console.log("New client connected");
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(() => getApiAndEmit(socket), 10000);
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
    const getApiAndEmit = async socket => {
        try {

            socket.emit("StudentRequest", {
                'name': creds.name, 'dob': creds.dob, 'phone': creds.phone, 'email': creds.email
            }); // Emitting a new message. It will be consumed by the client
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    };
}
