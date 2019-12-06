const decodeJWT = require('did-jwt').decodeJWT;
const { Credentials } = require('uport-credentials');
const transports = require('uport-transports').transport;
const message = require('uport-transports').message.util;
const StudentSchema = require('../models/student.model');
const serverCredentials = require('../../constants/main.constant').credentials;
const updateArrayInSchoolSchema = require('../../utilities/helpers/update-array.helper');

const credentials = new Credentials(serverCredentials);

exports.showQRCode = async (req, res, next) => {
    try {
        const requestToken = await credentials.createDisclosureRequest({
            requested: ["name", "email", "phone", "birthDate"],
            notifications: true,
            callbackUrl: process.env.BASE_URL.concat('callback'),
            callback_url: process.env.BASE_URL.concat('callback')
        });

        if (requestToken) {
            console.log(decodeJWT(requestToken));  //log request token to console
            const uri = message.paramsToQueryString(message.messageToURI(requestToken), { callback_type: 'post' });
            const qr = transports.ui.getImageDataURI(uri); // todo cahnge here with google playstore link ...
            console.log(qr);
            const logoPath = `${process.env.BASE_URL}img/logo.png`;
            const htmlNode = `<div style="width: 100%;display: flex;justify-content:center ;align-items: center;height: 100vh;">
                        <div style=" width: 1000px; display: block;">
                        <img src="${logoPath}" style=" width: 100%; display: block;"/>
                        </div>
                        <div className="qr_code">
                            <img src="${qr}" width='400' height='400' />
                        </div>
                    </div>`;
            res.send(htmlNode);
        }
    } catch (error) {
        next(error);
    }
};

exports.verifyClaims = async (req, res, next) => {

    try {
        const jwt = req.body.access_token;
        const creds = await credentials.authenticateDisclosureResponse(jwt);
        if (creds) {
            // take this time to perform custom authorization steps... then,
            // set up a push transport with the provided 
            // push token and public encryption key (boxPub)
            const push = transports.push.send(creds.pushToken, creds.boxPub);
            const newStudent = new StudentSchema(creds);
            newStudent.fullName = creds.name;
            newStudent.mobile = creds.phone;
            const createStudent = await newStudent.save();
            if (createStudent) {
                console.log('Student Created');
                // update student array

                const updated = await updateArrayInSchoolSchema.addStudentInSchool(creds.did);
                if (updated) {
                    createVerification(creds, push, next);
                }
            }
        }
    } catch (error) {
        next(error);
    }
}

function createVerification(creds, push, next) {
    credentials.createVerification({
        sub: creds.did,
        exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
        claim: { 'name': creds.name, 'dob': creds.dob, 'phone': creds.phone, 'email': creds.email }
        // Note, the above is a complex (nested) claim. 
        // Also supported are simple claims:  claim: {'Key' : 'Value'}
    })
        .then(attestation => {
            console.log(`Encoded JWT sent to user: ${attestation}`);
            console.log(`Decodeded JWT sent to user: ${JSON.stringify(decodeJWT(attestation))}`);
            return push(attestation); // *push* the notification to the user's mobile app.
        })
        .then(res => {
            console.log(res);
            console.log('Push notification sent and should be recieved any moment...');
            console.log('Accept the push notification in the xdemic mobile application');
        })
        .catch(err => {
            console.log(err);
            next(err.message);
        });
}




// function sendNotification(creds) {

//     const io = require('../../../server').io;
//     console.log('sending push notification using socket io');
//     let interval;
//     io.on("connection", socket => {
//         console.log("New client connected");
//         if (interval) {
//             clearInterval(interval);
//         }
//         interval = setInterval(() => getApiAndEmit(socket), 10000);
//         socket.on("disconnect", () => {
//             console.log("Client disconnected");
//         });
//     });
//     const getApiAndEmit = async socket => {
//         try {

//             socket.emit("StudentRequest", {
//                 'name': creds.name, 'dob': creds.dob, 'phone': creds.phone, 'email': creds.email
//             }); // Emitting a new message. It will be consumed by the client
//         } catch (error) {
//             console.error(`Error: ${error.message}`);
//         }
//     };
// }
