const SchoolSchema = require('../models/school-registration.model');


exports.createNewSchool = (req, res, next) => {

    console.log(req.body);
    const newSchool = new SchoolSchema(req.body);

    newSchool.save()
        .then(data => {
            return res.status(200).json({
                status: true,
                data: data
            })
        })
        .catch(err => {
            next(err.message);
        })
}

exports.getSchool = (req, res, next) => {
    SchoolSchema.find()
        .then(data => {
            if (data.length > 0) {
                console.log('inside else');
                return res.status(200).json({
                    status: true,
                    data: data
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'no record found'
                })
            }
        })
        .catch(err => {
            next(err.message);
        })
}

function sendSchoolSchema(schoolData) {
    const decodeJWT = require('did-jwt').decodeJWT;
    const transports = require('uport-transports').transport;

    const pushToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1Njc1ODM2MDIsImV4cCI6MTU5OTExOTYwMiwiYXVkIjoiZGlkOmV0aHI6MHhkNzQxYTZkZDI3MTE1MjFlODc5OGZiZTkyYzEyZmNiOWQyZjQzY2YxIiwidHlwZSI6Im5vdGlmaWNhdGlvbnMiLCJ2YWx1ZSI6ImFybjphd3M6c25zOnVzLXdlc3QtMjoxMTMxOTYyMTY1NTg6ZW5kcG9pbnQvR0NNL3VQb3J0Lzc0Njk2YTE4LTE2ODctMzBiYy1hYzI3LWY1M2ViMTE0OTZiMCIsImlzcyI6ImRpZDpldGhyOjB4YTA1NmZmYmZkNjQ0ZTQ4MmFkOGQ3MjJjNGJlNGM2NmFhMDUyYWQ1YSJ9.p4EJRCsDndG61gO32xHBLm8bJkWJ6tQGv5R4OYf2rfFs57W5MMqe9kEdopOZqqn95G0Sz8kN2izL2Xi01cGEngE';
    const boxPub = 'enU9f7sZB7JsbcHLSfset6uZgVA44xI6y039RO5srk4='

    credentials.createVerification({
        sub: 'did:ethr:0xa056ffbfd644e482ad8d722c4be4c66aa052ad5a',
        exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
        claim: schoolData // sending school schema to demic mobile app
        // Note, the above is a complex (nested) claim. 
        // Also supported are simple claims:  claim: {'Key' : 'Value'}
    }).then(attestation => {
        const push = transports.push.send(pushToken, boxPub);
        console.log(`Encoded JWT sent to user: ${attestation}`)
        console.log(`Decodeded JWT sent to user: ${JSON.stringify(decodeJWT(attestation))}`)
        return push(attestation)  // *push* the notification to the user's mobile app.
    }).then(res => {
        console.log(res)
        console.log('Push notification sent and should be recieved any moment...')
        console.log('Accept the push notification in the xdemic mobile application')
    })
        .catch(err => {
            console.log('Error');
            console.log(err);
        });
    // })
}