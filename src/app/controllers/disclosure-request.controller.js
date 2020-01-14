const decodeJWT = require('did-jwt').decodeJWT;
const { Credentials } = require('uport-credentials');
const transports = require('uport-transports').transport;
const message = require('uport-transports').message.util;
const StudentSchema = require('../models/student.model');
const serverCredentials = require('../../constants/main.constant').credentials;
const updateArrayInSchoolSchema = require('../../utilities/helpers/update-array.helper');
const AdminModel = require('../models/admin.model');

const credentials = new Credentials(serverCredentials);

exports.showQRCode = async (req, res, next) => {
    try {
        const requestToken = await credentials.createDisclosureRequest({
            requested: ["name", "did", "department", "birthDate", "gender", "email", "phone", "avatar"],
            notifications: true,
            callbackUrl: process.env.BASE_URL.concat('callback'),
            callback_url: process.env.BASE_URL.concat('callback')
        });

        if (requestToken) {
            // console.log(decodeJWT(requestToken));  //log request token to console
            const uri = message.paramsToQueryString(message.messageToURI(requestToken), { callback_type: 'post' });
            const qr = transports.ui.getImageDataURI(uri); // todo cahnge here with google playstore link ...
            // console.log(qr);
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
            console.log(creds);
            const createAdmin = new AdminModel(creds);
            createAdmin.fullName = creds.name;
            createAdmin.mobile = creds.phone;
            createAdmin.department = creds.department;
            createAdmin.boxPub = creds.boxPub;
            createAdmin.birthDate = creds.birthDate;
            createAdmin.gender = creds.gender;
            createAdmin.email = creds.email;
            createAdmin.did = creds.did;
            createAdmin.pushToken = creds.pushToken;
            const data = await createAdmin.save();
            createVerification(creds, push, next, data);
            // const createStudent = await newStudent.save();
            // if (createStudent) {
            //     console.log('Student Created');
            //     // update student array

            //     const updated = await updateArrayInSchoolSchema.addStudentInSchool(creds.did);
            //     if (updated) {
            //         createVerification(creds, push, next);
            //     }
            // }
        }
    } catch (error) {
        next(error);
    }
}

function createVerification(creds, push, next, data) {
    credentials.createVerification({
        sub: creds.did,
        exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
        claim: { 'name': creds.name, 'dob': creds.dob, 'phone': creds.phone, 'email': creds.email }
        // Note, the above is a complex (nested) claim. 
        // Also supported are simple claims:  claim: {'Key' : 'Value'}
    })
        .then(attestation => {
            // console.log(`Encoded JWT sent to user: ${attestation}`);
            // console.log(`Decodeded JWT sent to user: ${JSON.stringify(decodeJWT(attestation))}`);
            return push(attestation); // *push* the notification to the user's mobile app.
        })
        .then(res => {
            console.log('Push notification sent and should be recieved any moment...');
            global.io.emit('QRCodeSuccess', {
                status: true,
                data: data
            });
        })
        .catch(err => {
            next(err);
        });
}

