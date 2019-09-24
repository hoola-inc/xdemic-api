const decodeJWT = require('did-jwt').decodeJWT;
const { Credentials } = require('uport-credentials');
const transports = require('uport-transports').transport;
const message = require('uport-transports').message.util;
const StudentSchema = require('../models/student.model');
const io = require('socket.io');
const schoolSchema = require('../models/school.model');

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

function updateStudnetArrayInSchool(studentData) {
    return new Promise((resolve, reject) => {
        const studentDID = studentData.did;
        console.log('Student DID ::: ', studentDID);

        schoolSchema.find()
            .then(data => {
                if (data.length > 0) {
                    const schoolId = data[0]._id;
                    console.log('School Id ::: ', schoolId);
                    schoolSchema.update({
                        _id: schoolId
                    }, {
                        $push: {
                            student: {
                                'studentDID': studentDID
                            }
                        }
                    })
                    .then(school => {
                        resolve('school updated');
                    })
                    .catch(err => {
                        reject('school not updated');
                        return;
                    })
                }
            })
            .catch(err => {
                throw new Error('erorr while finding school')
            })
    })
}


// exports.updateFoo = (req, res, next) => {
//     const studentDID = 'did:cccccc';
//     console.log('Student DID ::: ', studentDID);

//     schoolSchema.find()
//         .then(data => {
//             if (data.length > 0) {
//                 const schoolId = data[0]._id;
//                 console.log('School Id ::: ', schoolId);
//                 schoolSchema.update({
//                     _id: schoolId
//                 }, {
//                     $push: {
//                         student: {
//                             'studentDID': studentDID
//                         }
//                     }
//                 })
//                     .then(updated => {
//                         console.log('updated')
//                     })
//                     .catch(err => {
//                         console.log(err.message)
//                     })
//             }
//         })
//         .then(updatedStudent => {
//             console.log('find all response')
//         })
//         .catch(err => {
//             console.log(err.message)
//         })

// }
