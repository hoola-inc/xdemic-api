const SchoolSchema = require('../models/school-registration.model');
const { Credentials } = require('uport-credentials');
const contants = require('../../constants/main.constant');


const credentials = new Credentials(contants.credentials);


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
                sendSchoolSchema(data)
                    .then(signedJwt => {
                        return res.status(200).send({
                            status: true,
                            data: signedJwt
                        })
                    })
                    .catch(err => {
                        next(err.message)
                    })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'no record found'
                });
            }
        })
        .catch(err => {
            next(err.message);
        })
}

function sendSchoolSchema(schoolData) {
    return new Promise((resolve, reject) => {
        credentials.createVerification({
            sub: 'did:ethr:0xa056ffbfd644e482ad8d722c4be4c66aa052ad5a',
            exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
            claim: schoolData
        }).then(attestation => {
            resolve(attestation);
        })
            .catch(err => {
                reject(err.message);
            });
    })
}