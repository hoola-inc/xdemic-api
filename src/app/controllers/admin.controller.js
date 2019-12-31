const AdminModel = require('../models/admin.model');
const decodeJWT = require('did-jwt').decodeJWT;
const serverCredentials = require('../../utilities/create-credentials.utility').credentials;
const transports = require('uport-transports').transport;
const message = require('uport-transports').message.util;


exports.adminQRCode = async (req, res, next) => {

    try {
        const requestToken = await serverCredentials.createDisclosureRequest({
            requested: ["name", "id", "department", "birthDate", "gender", "email", "phone", "avatar"],
            notifications: true,
            callbackUrl: process.env.BASE_URL.concat('callback'),
            callback_url: process.env.BASE_URL.concat('callback')
        });

        if (requestToken) {
            console.log(decodeJWT(requestToken));  //log request token to console
            const uri = message.paramsToQueryString(message.messageToURI(requestToken), { callback_type: 'post' });
            const qr = transports.ui.getImageDataURI(uri); // TODO change here with google playstore link ...
            console.log(qr);
            res.send(qr);
        }
    } catch (error) {
        next(error);
    }

}

exports.createAdmin = async (req, res, next) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(200).json({
            status: false,
            message: 'Request body is null'
        });
    }

    try {
        const jwt = req.body.access_token
        const creds = await serverCredentials.authenticateDisclosureResponse(jwt);
        if (creds) {
            const push = transports.push.send(creds.pushToken, creds.boxPub);
            const newAdmin = new AdminModel(creds);
            newAdmin.fullName = creds.name;
            newAdmin.mobile = creds.phone;
            const createNewAdmin = await newAdmin.save();
            if (createNewAdmin) {
                console.log('Admin created successfully...');
                createVerification(creds, push, next);
            }
        }
    } catch (error) {
        next(error);
    }
}

function createVerification(creds, push, next) {
    serverCredentials.createVerification({
        sub: creds.did,
        exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
        claim: {
            'name': creds.name, 'dob': creds.dob, 'phone': creds.phone, 'email': creds.email
        }
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
            sendNotification(creds);
        })
        .catch(err => {
            throw new Error(err);
        });
}
