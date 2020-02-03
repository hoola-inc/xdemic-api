'use strict'

const studentModel = require('../models/student.model');
const jwtSigner = require('../../utilities/jwt-signature-generator');
const { Credentials } = require('uport-credentials');
const encryptMessage = require('../../utilities/encryption.utility');
const updateArrayHelper = require('../../utilities/helpers/update-array.helper');
const schoolSchema = require('../models/school.model');
const response = require('../../utilities/response.utils');

exports.addStudent = async (req, res, next) => {
    try {

        // add new student
        const addNewStudent = new studentModel(req.body, true);
        const createStudent = await addNewStudent.save();

        // return reponse
        return res.status(200).json({
            status: true,
            data: createStudent
        });

    } catch (error) {
        next(error);
    }
}

exports.getAllStudents = async (req, res, next) => {
    try {
        const allStudentsRecord = await studentModel.find();
        if (allStudentsRecord.length > 0) {
            return res.status(200).json({
                status: true,
                length: allStudentsRecord.length,
                data: allStudentsRecord
            });
        }
        return res.status(200).json({
            status: false,
            message: 'student not found'
        });
    } catch (error) {
        next(error);
    }
}

exports.getSingleStudent = async (req, res, next) => {
    try {
        const did = req.params.did;
        const getStudentReacord = await studentModel.find({
            did: did
        });
        if (getStudentReacord) {
            const jwtSignature = await jwtSigner.jwtSchema(did, getStudentReacord);
            if (jwtSignature) {
                return res.status(200).json({
                    status: true,
                    data: jwtSignature
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: `no student found with did ${did}`
            });
        }
    } catch (error) {
        next(error);
    }
}


exports.getAllStudentsJWT = async (req, res, next) => {

    try {
        const allStudentsRecord = await studentModel.find();
        if (allStudentsRecord.length > 0) {
            //todo DID required ...
            const jwtHash = await jwtSigner.jwtSchema('', allStudentsRecord);
            // console.log(jwtHash);
            if (jwtHash) {
                return res.status(200).send({
                    status: true,
                    data: jwtHash
                });
            } else {
                throw new Error('An error occured while creating jwt hash');
            }
        } else {
            return res.status(200).json({
                status: false,
                message: 'student not found'
            });
        }
    } catch (error) {
        next(error);
    }
}

exports.getfavoriteSchools = async (req, res, next) => {
    try {
        const did = req.params.did;
        const stdFavSchools = await studentModel.findOne({
            did: did
        });
        if (stdFavSchools) {
            const schoolDidArr = stdFavSchools.favoriteSchools;
            console.log(schoolDidArr);
            schoolSchema.find({
                'did': {
                    $in: schoolDidArr
                }
            })
                .then(data => {
                    response.SUCCESS(res, data);
                })
        } else {
            return res.status(200).json({
                status: false,
                message: 'no record found'
            })
        }
    } catch (error) {
        next(error);
    }
}

exports.updateFavSchoolArray = async (req, res, next) => {
    try {
        const schoolDID = req.body.did;
        const isFavorite = req.body.isFavorite;
        const studentDID = req.params.id;
        const schoolUpdated = await updateArrayHelper.favoriteSchools(studentDID, schoolDID);
        next(schoolUpdated);
    } catch (error) {
        next(error);
    }
}