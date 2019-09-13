const SchoolSchema = require('../models/school-registration.model');
const CredentialSchema = require('../models/credentials.model');
const sendJWt = require('../../utilities/send-signed-jwt.utility');
const didGenerator = require('../../utilities/did-generator.utility');


exports.createSchool = (req, res, next) => {
    const schoolDid = didGenerator.did;
    const schoolPrivateKey = didGenerator.privateKey;

    const createNewCredentials = new CredentialSchema({
        did: schoolDid,
        privateKey: schoolPrivateKey
    });

    createNewCredentials.save()
        .then(data => {
            if (data) {
                createNewSchool(req, schoolDid, res, next);
            }
        })
        .catch(err => {
            next(err.message);
        })


}

exports.getSchool = (req, res, next) => {
    SchoolSchema.find()
        .then(data => {
            if (data.length > 0) {
                res.status(200).json({
                    status: true,
                    length: data.length,
                    schoolRecords: data
                })
            } else {
                res.status(200).json({
                    status: false,
                    message: 'not record found'
                })
            }
        })
        .catch(err => {
            next(err.message)
        })
}

exports.getSchoolWithSignedJWT = (req, res, next) => {
    SchoolSchema.find()
        .then(data => {
            if (data.length > 0) {
                sendJWt.sendSchoolSchema('did:ethr:0xa056ffbfd644e482ad8d722c4be4c66aa052ad5a', data)
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

function createNewSchool(req, schoolDid, res, next) {
    const newSchool = new SchoolSchema({
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        subjectWebpage: req.body.subjectWebpage,
        agentSectorType: req.body.agentSectorType,
        agentType: req.body.agentType,
        description: req.body.description,
        did: schoolDid
    });
    newSchool.save()
        .then(data => {
            return res.status(200).json({
                status: true,
                data: data
            });
        })
        .catch(err => {
            next(err.message);
        });
}

