const decodeJWT = require('did-jwt').decodeJWT;
const { Credentials } = require('uport-credentials');
const transports = require('uport-transports').transport;
const message = require('uport-transports').message.util;
const endpoint = require('../../constants/main.constant').BASE_URL;
const SchoolSchema = require('../models/xdemic-login.model');
const path = require('path');


exports.createNewSchool = async (req, res) => {

    // return push(attestation); // *push* the notification to the user's uPort mobile app.
    try {
        const verifyClaim = req.body.schema;
        console.log(verifyClaim)
        // return push(decodedSchema);
        return res.status(200).json({
            success: true,
            data: decodedSchema
        })
    } catch (err) {
        return res.status(200).send({
            success: false,
            message: err.message
        });
    }
}

exports.yo = async (req, res) => {
    console.log(' i am hitting ...');
    res.sendFile(path.join(__dirname + '/index.html'));
}
