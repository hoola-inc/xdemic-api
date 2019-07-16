const decodeJWT = require('did-jwt').decodeJWT;
const { Credentials } = require('uport-credentials');
const transports = require('uport-transports').transport;
const message = require('uport-transports').message.util;
const endpoint = require('../../constants/main.constant').BASE_URL;
const SchoolSchema = require('../models/uport-login.model');

exports.createNewSchool = async (req, res) => {
    const attestation = req.body.attestation;
    console.log(attestation);
    console.log(`Decoded ::: ${JSON.stringify(decodeJWT(attestation))}`);
    return push(attestation); // *push* the notification to the user's uPort mobile app.
    // try {
    //     const newschool = await TestController.create(req.body);

    //     if (newSchool) {
    //         return res.status(200).send({
    //             success: true,
    //             data: newSchool
    //         });
    //     }
    // } catch (err) {
    //     return res.status(200).send({
    //         success: false,
    //         message: err.message
    //     });
    // }
}



