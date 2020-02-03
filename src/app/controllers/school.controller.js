'use strict'

const SchoolSchema = require('../models/school.model');
const sendJWt = require('../../utilities/jwt-signature-generator');
const saveCredentials = require('../../utilities/save-credentials');
const jwtSignature = require('../../utilities/jwt-signature-generator');

exports.createSchool = async (req, res, next) => {

    try {
        if (req.file) {
            console.log('with file ... ');
            //saving did and prvKey in credentials collection
            // const newCredentials = await saveCredentials.saveNewCredentials();
            // const did = newCredentials.did;

            const newSchool = new SchoolSchema(req.body);
            // setting school did
            // newSchool.did = did;
            newSchool.logo = req.file.name

            const createNewSchool = await newSchool.save();
            return res.status(200).json({
                status: true,
                data: createNewSchool
            });
        } else {
            console.log('without file ...');
            //saving did and prvKey in credentials collection
            const newCredentials = await saveCredentials.saveNewCredentials();
            const did = newCredentials.did;

            const newSchool = new SchoolSchema(req.body);
            // setting school did
            newSchool.did = did;

            const createNewSchool = await newSchool.save();
            return res.status(200).json({
                status: true,
                data: createNewSchool
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.getSchool = async (req, res, next) => {
    try {
        const getSchools = await SchoolSchema.find();
        if (getSchools.length > 0) {
            const schoolDataHash = await jwtSignature.jwtSchema(process.env.SERVER_DID, getSchools);
            return res.status(200).json({
                status: true,
                data: schoolDataHash
            });
        } else {
            return res.status(200).json({
                status: false,
                message: 'no record found'
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.getSchoolWithStudent = (req, res, next) => {

    // todo cahnge here 
    // SchoolSchema.find({
    //     "student.studentDID": req.params.did
    // })
    const schoolDID = req.params.did;
    SchoolSchema.find({
        did: schoolDID
    })
        .then(data => {
            console.log(data);
            if (data.length > 0) {
                return res.status(200).json({
                    status: true,
                    data: data
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'no student enroll with school yet'
                })
            }
        })
        .catch(err => {
            next(err);
        })
}

exports.getSchoolWithSignedJWT = (req, res, next) => {
    SchoolSchema.find()
        .then(data => {
            if (data.length > 0) {
                sendJWt.jwtSchema('did:ethr:0xa056ffbfd644e482ad8d722c4be4c66aa052ad5a', data)
                    .then(signedJwt => {
                        return res.status(200).send({
                            status: true,
                            data: signedJwt
                        })
                    })
                    .catch(err => {
                        next(err)
                    })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'no record found'
                });
            }
        })
        .catch(err => {
            next(err);
        })
}
