'use strict'
const CourseSchema = require('../models/course.model');
const schoolSchema = require('../models/school.model');
const saveCredentials = require('../../utilities/save-credentials');
const writeFile = require('../../utilities/write-to-file.utility');
const addToIPFS = require('../../utilities/ipfs-add-file.utility');
const ipfsLink = require('../../constants/main.constant').ipfsLink;
const jwtSigner = require('../../utilities/jwt-signature-generator');
const response = require('../../utilities/response.utils');


/**
 * create new course
 */

exports.createNewCourse = async (req, res, next) => {
    try {

        // TODO change here for req timeout...
        req.setTimeout(120000);
        //saving did and prvKey in credentials collection
        const newCredentials = await saveCredentials.saveNewCredentials();
        const did = newCredentials.did;
        // creating new course obj
        const newCourse = new CourseSchema(req.body);
        // setting issuer did
        newCourse.issuer.id = did;

        // creating course document proof
        const courseProofSignature = await jwtSigner.jwtSchema(did, newCourse);

        newCourse.proof.verificationMethod = did;
        newCourse.proof.jws = courseProofSignature;

        if (courseProofSignature) {
            // saving new course
            const createNewCourse = await newCourse.save();

            // waiting to write file with new course data
            // const isWritten = await writeFile.writeToFile(did, 'courses', createNewCourse);
            // hosting to ipfs 
            // const path = require('path').join(__dirname, `../../../public/files/courses/${did}.json`);
            // // const ipfsFileHash = await addToIPFS.addFileIPFS(did, path);
            return res.status(200).json({
                status: true,
                data: createNewCourse,
                // ipfs: ipfsLink.ipfsURL + ipfsFileHash
            });
        }
    } catch (error) {
        next(error);
    }
};


/**
 * Find all courses
 */

exports.getAllCourses = async (req, res, next) => {
    try {
        const getAllCourses = await CourseSchema.find().lean();
        if (allCourses.length > 0) response.GETSUCCESS(res, getAllCourses.reverse());
        else response.NOTFOUND(res);
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
            next(err);
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
            next(err);
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
