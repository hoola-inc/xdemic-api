'use strict'
const CourseSchema = require('../models/course.model');
const schoolSchema = require('../models/school.model');
const saveCredentials = require('../../utilities/save-credentials');
const writeFile = require('../../utilities/write-to-file.utility');
const addToIPFS = require('../../utilities/ipfs-add-file.utility');
const ipfsLink = require('../../constants/main.constant').ipfsLink;
const jwtSigner = require('../../utilities/jwt-signature-generator');
const courseProof = require('../../constants/main.constant').proof;


exports.createNewCourse = async (req, res, next) => {
    try {
        //saving did and prvKey in credentials collection
        const newCredentials = await saveCredentials.saveNewCredentials();
        const did = newCredentials.did;
        // creating new course obj
        const newCourse = new CourseSchema(req.body);
        // setting issuer did
        newCourse.issuer.id = did;
        // saving new course
        const createNewCourse = await newCourse.save();
        if (createNewCourse) {
            console.log(createNewCourse);
            // creating course document proof
            const courseProofSignature = await jwtSigner.jwtSchema(did, createNewCourse);
            if (courseProofSignature) {

                courseProof.proof.created =  new Date().toLocaleString()
                courseProof.proof.verificationMethod = did;
                courseProof.proof.jws = courseProofSignature;
                // appending proof with JWS in recently created course
                let assign = Object.assign(courseProof, createNewCourse);

                console.log('YO ::: ', assign);

                // waiting to write file with new course data
                const isWritten = await writeFile.writeToFile(did, 'courses', assign);
                if (isWritten) {
                    // hosting to ipfs 
                    const path = require('path').join(__dirname, `../../../public/files/courses/${did}.json`);
                    const ipfsFileHash = await addToIPFS.addFileIPFS(did, path);
                    if (ipfsFileHash) {
                        return res.status(200).json({
                            status: true,
                            data: assign,
                            ipfs: ipfsLink.ipfsURL + ipfsFileHash
                        });
                    }
                }
            }
        }
    } catch (error) {
        next(error);
    }
};

exports.getAllCourses = async (req, res, next) => {
    try {
        const allCourses = await CourseSchema.find();
        if (allCourses.length > 0) {
            return res.status(200).json({
                status: true,
                length: allCourses.length,
                data: allCourses.reverse()
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
}

exports.getCourseByDID = async (req, res, next) => {
    try {
        const did = req.params.did;
        const getCourse = await CourseSchema.find({
            'issuer.id': did
        });

        if (getCourse.length > 0) {
            const jwtSignature = await jwtSigner.jwtSchema(did, getCourse);
            if (jwtSignature) {
                return res.status(200).json({
                    status: true,
                    data: jwtSignature
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: 'no record found with did: ' + did
            });
        }
    } catch (error) {
        next(error)
    }
}

exports.getCourseById = (req, res, next) => {
    CourseSchema.find({
        _id: req.params.id
    })
        .then(data => {
            if (data.length > 0) {
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

exports.updateCourseGrade = (req, res, next) => {
    CourseSchema.update({
        _id: req.params.id
    },
        {
            $set: {
                courseGrade: req.body.courseGrade
            }
        })
        .then(data => {
            if (data) {
                return res.status(200).json({
                    status: true,
                    message: 'course grade updated successfully'
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'course grade not updated'
                })
            }
        })
        .catch(err => {
            next(err.message);
        })
}


function updateCourseArrayInSchool(courseData) {
    return new Promise((resolve, reject) => {
        const courseID = courseData._id;
        console.log('Course id ::: ', courseID);

        schoolSchema.find()
            .then(data => {
                if (data.length > 0) {
                    const schoolId = data[0]._id;
                    console.log('School Id ::: ', schoolId);
                    schoolSchema.update({
                        _id: schoolId
                    }, {
                        $push: {
                            courses: {
                                'courseId': courseID
                            }
                        }
                    })
                        .then(school => {
                            resolve('course ID updated');
                        })
                        .catch(err => {
                            reject('course ID not updated');
                            return;
                        })
                }
            })
            .catch(err => {
                throw new Error('erorr while finding school')
            })
    })
}
