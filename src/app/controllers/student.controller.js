'use strict'

const studentModel = require('../models/student.model');
const jwtSigner = require('../../utilities/jwt-signature-generator');
const transports = require('uport-transports').transport;
const { Credentials } = require('uport-credentials');
const StudentSchooolModel = require('../models/student-school-bridge.model');
const nodemailer = require('nodemailer');
const ipfsLink = require('../../constants/main.constant').ipfsLink;
const courseSchema = require('../models/course.model');
const writeFile = require('../../utilities/write-to-file.utility');
const addToIPFS = require('../../utilities/ipfs-add-file.utility');
const saveCredentials = require('../../utilities/save-credentials');
const encryptMessage = require('../../utilities/encryption.utility');
const updateArrayHelper = require('../../utilities/helpers/update-array.helper');
const schoolSchema = require('../models/school.model');
const response = require('../../utilities/response.utils');

exports.addStudent = async (req, res, next) => {
    try {
        //saving did and prvKey in credentials collection
        const newCredentials = await saveCredentials.saveNewCredentials();
        const did = newCredentials.did;

        // add new student
        const addNewStudent = new studentModel(req.body, true);
        addNewStudent.did = did;
        const createStudent = await addNewStudent.save();

        // write to file
        await writeFile.writeToFile(did, 'students', createStudent);

        // ipfs
        const path = require('path').join(__dirname, `../../../public/files/students/${did}.json`);
        const ipfsFileHash = await addToIPFS.addFileIPFS(did, path);

        // return reponse
        return res.status(200).json({
            status: true,
            data: createStudent,
            ipfs: ipfsLink.ipfsURL + ipfsFileHash
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


// const credentials = new Credentials({
//     appName: 'Xdemic',
//     did: 'did:ethr:0xd741a6dd2711521e8798fbe92c12fcb9d2f43cf1',
//     privateKey: '8986bea04ec687c45be90c5a6e259dbf125291f3a8ede0b595442c39d3322875'
// });


// exports.sendCredentials = (req, res, next) => {

//     studentModel.find()
//         .then(data => {
//             const newData = data.reverse();
//             const pushToken = newData[0].pushToken;
//             const boxPub = newData[0].boxPub;
//             const courseUrl = '123';

//             const studentDID = newData[0].did;

//             const push = transports.push.send(pushToken, boxPub);

//             credentials.createVerification({
//                 sub: 'Course Credentials',
//                 exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
//                 claim: courseUrl
//                 // Note, the above is a complex (nested) claim. 
//                 // Also supported are simple claims:  claim: {'Key' : 'Value'}
//             }).then(attestation => {
//                 console.log(`Encoded JWT sent to user: ${attestation}`);
//                 // console.log(`Decodeded JWT sent to user: ${JSON.stringify(decodeJWT(attestation))}`);
//                 return push(attestation); // *push* the notification to the user's mobile app.
//             }).then(not => {
//                 console.log(not);
//                 console.log(`Notification sent to user ::: ${newData[0].name}`)
//                 console.log('Push notification sent and should be recieved any moment...');
//                 console.log('Accept the push notification in the xdemic mobile application');
//                 updateStudentArray(studentDID)
//                     .then(updateStudent => {
//                         return res.status(200).json({
//                             status: true,
//                             message: "Notification sent"
//                         })
//                     })
//                     .catch(err => {
//                         console.log(err.message);
//                     })
//             })
//                 .catch(err => {
//                     console.log(err);
//                 });

//         })
//         .catch(err => {
//             console.log(err);
//             next(err.message);
//         })
// }

// function updateStudentArray(studentDID) {
//     return new Promise((resolve, reject) => {
//         courseSchema.find()
//             .then(data => {
//                 if (data.length > 0) {
//                     const courseID = data[0]._id;
//                     console.log('School Id ::: ', courseID);
//                     courseSchema.update({
//                         _id: courseID
//                     }, {
//                         $push: {
//                             students: {
//                                 'studentDID': studentDID
//                             }
//                         }
//                     })
//                         .then(school => {
//                             resolve('course student updated');
//                         })
//                         .catch(err => {
//                             reject('school not updated');
//                             return;
//                         })
//                 }
//             })
//             .catch(err => {
//                 throw new Error('erorr while finding school')
//             })
//     })
// }

// exports.addStudentFromMobile = (req, res, next) => {

//     const schoolName = req.body.schoolName;
//     const studentName = req.body.studentName;

//     if (typeof schoolName == 'string' && typeof studentName == 'string') {
//         const create = new StudentSchooolModel(req.body);

//         create.save()
//             .then(data => {
//                 return res.status(200).json({
//                     status: true,
//                     data: data
//                 })
//             })
//             .catch(err => {
//                 next(err.message);
//             })
//     } else {
//         throw new Error('String required');
//     }

// }

// exports.getStudentById = (req, res, next) => {
//     studentModel.find({
//         _id: req.params.id
//     })
//         .then(data => {
//             if (data.length > 0) {
//                 return res.status(200).json({
//                     status: true,
//                     data: data
//                 })
//             } else {
//                 return res.status(200).json({
//                     status: false,
//                     message: 'no record found'
//                 })
//             }
//         })
//         .catch(err => {
//             next(err.message);
//         })
// }

// exports.updateStudents = (req, res, next) => {
//     console.log(req.body.courseId);
//     studentModel.update({
//         _id: req.params.id
//     },
//         {
//             $set: {
//                 courseId: req.body.courseId
//             }
//         })
//         .then(data => {
//             if (data) {
//                 return res.status(200).json({
//                     status: true,
//                     message: 'user updated successfully'
//                 })
//             } else {
//                 return res.status(200).json({
//                     status: false,
//                     message: 'user not updated'
//                 })
//             }
//         })
//         .catch(err => {
//             next(err.message);
//         })
// }


// exports.getEnrollStudents = (req, res, next) => {
//     studentModel.find({
//         courseId: req.params.id
//     })
//         .then(data => {
//             if (data.length > 0) {
//                 return res.status(200).json({
//                     status: true,
//                     data: data
//                 })
//             } else {
//                 return res.status(200).json({
//                     status: false,
//                     message: 'no enroll student'
//                 })
//             }
//         })
//         .catch(err => {
//             next(err.message)
//         })
// }

// exports.sendTranscript = (req, res, next) => {
//     const targetEmail = req.body.email;
//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: process.env.EMAIL,
//             pass: process.env.PASSWORD
//         }
//     });

//     const mailOptions = {
//         from: process.env.EMAIL,
//         to: targetEmail,
//         subject: 'Transcript',
//         text: process.env.Student_Transcript_URL + ', Code: 95942'
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             next(error);
//         }
//         else {

//             console.log('email sent successfully...');
//             return res.status(200).send({
//                 status: true,
//                 message: 'Email sent '
//             })
//         }
//     });
// }


// exports.sendTranscriptToDashboard = (req, res, next) => {
//     const targetEmail = req.body.email;
//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: process.env.EMAIL,
//             pass: process.env.PASSWORD
//         }
//     });

//     const mailOptions = {
//         from: process.env.EMAIL,
//         to: targetEmail,
//         subject: 'Transcript',
//         text: req.body
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             next(error);
//         }
//         else {

//             console.log('email sent successfully...');
//             return res.status(200).send({
//                 status: true,
//                 message: 'Email sent '
//             })
//         }
//     });
// }