const studentModel = require('../models/student.model');
const jwtSigner = require('../../utilities/jwt-signature-generator');
const transports = require('uport-transports').transport;
const { Credentials } = require('uport-credentials');
const StudentSchooolModel = require('../models/student-school-bridge.model');
const nodemailer = require('nodemailer');
const courseSchema = require('../models/course.model');
const CredentialsModel = require('../models/credentials.model');
const writeFile = require('../../utilities/write-to-file.utility');
const addToIPFS = require('../../utilities/ipfs-add-file.utility');
const fs = require('fs');

exports.addStudent = async (req, res, next) => {
    try {
        const { did, privateKey } = Credentials.createIdentity();
        const credentials = await saveCredentials(did, privateKey);
        if (credentials) {
            const addNewStudent = new studentModel({
                fullName: req.body.fullName,
                givenName: req.body.givenName,
                familyName: req.body.familyName,
                email: req.body.email,
                mobile: req.body.mobile,
                URL: req.body.URL,
                birthDate: req.body.birthDate,
                sourcedId: req.body.sourcedId,
                did: did
            });

            const createStudent = await addNewStudent.save();
            if (createStudent) {
                const isWritten = await writeFile.writeToFile(did, 'students', createStudent);
                if (isWritten) {
                    const path = require('path').join(__dirname, `../../../public/files/students/${did}.json`);
                    const fileHash = await addToIPFS.addFileIPFS(did, path);

                    return res.status(200).json({
                        status: true,
                        data: createStudent,
                        hash: fileHash
                    });
                } else {
                    throw new Erorr('An error occured while writing student to the file');
                }
            } else {
                throw new Error('An error occured while creating student');
            }
        } else {
            throw new Error('An error occured while creating credentials');
        }
    } catch (error) {
        next(error);
    }
}

saveCredentials = async (did, privateKey) => {
    try {
        const addNewCredentials = new CredentialsModel({
            did: did,
            privateKey: privateKey
        });

        const createNewCredentials = await addNewCredentials.save();

        return createNewCredentials ? true : false

    } catch (error) {
        throw new Error(error);
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



const credentials = new Credentials({
    appName: 'Xdemic',
    did: 'did:ethr:0xd741a6dd2711521e8798fbe92c12fcb9d2f43cf1',
    privateKey: '8986bea04ec687c45be90c5a6e259dbf125291f3a8ede0b595442c39d3322875'
});


exports.sendCredentials = (req, res, next) => {

    studentModel.find()
        .then(data => {
            const newData = data.reverse();
            const pushToken = newData[0].pushToken;
            const boxPub = newData[0].boxPub;
            const courseUrl = courseDocumentData();

            const studentDID = newData[0].did;

            const push = transports.push.send(pushToken, boxPub);

            credentials.createVerification({
                sub: 'Course Credentials',
                exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
                claim: courseUrl
                // Note, the above is a complex (nested) claim. 
                // Also supported are simple claims:  claim: {'Key' : 'Value'}
            }).then(attestation => {
                console.log(`Encoded JWT sent to user: ${attestation}`);
                // console.log(`Decodeded JWT sent to user: ${JSON.stringify(decodeJWT(attestation))}`);
                return push(attestation); // *push* the notification to the user's mobile app.
            }).then(not => {
                console.log(not);
                console.log(`Notification sent to user ::: ${newData[0].name}`)
                console.log('Push notification sent and should be recieved any moment...');
                console.log('Accept the push notification in the xdemic mobile application');
                updateStudentArray(studentDID)
                    .then(updateStudent => {
                        return res.status(200).json({
                            status: true,
                            message: "Notification sent"
                        })
                    })
                    .catch(err => {
                        console.log(err.message);
                    })
            })
                .catch(err => {
                    console.log(err);
                });

        })
        .catch(err => {
            console.log(err);
            next(err.message);
        })
}

function updateStudentArray(studentDID) {
    return new Promise((resolve, reject) => {
        courseSchema.find()
            .then(data => {
                if (data.length > 0) {
                    const courseID = data[0]._id;
                    console.log('School Id ::: ', courseID);
                    courseSchema.update({
                        _id: courseID
                    }, {
                        $push: {
                            students: {
                                'studentDID': studentDID
                            }
                        }
                    })
                        .then(school => {
                            resolve('course student updated');
                        })
                        .catch(err => {
                            reject('school not updated');
                            return;
                        })
                }
            })
            .catch(err => {
                throw new Error('erorr while finding school')
            })
    })
}

exports.addStudentFromMobile = (req, res, next) => {

    const schoolName = req.body.schoolName;
    const studentName = req.body.studentName;

    if (typeof schoolName == 'string' && typeof studentName == 'string') {
        const create = new StudentSchooolModel(req.body);

        create.save()
            .then(data => {
                return res.status(200).json({
                    status: true,
                    data: data
                })
            })
            .catch(err => {
                next(err.message);
            })
    } else {
        throw new Error('String required');
    }

}

exports.getStudentById = (req, res, next) => {
    studentModel.find({
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

exports.updateStudents = (req, res, next) => {
    console.log(req.body.courseId);
    studentModel.update({
        _id: req.params.id
    },
        {
            $set: {
                courseId: req.body.courseId
            }
        })
        .then(data => {
            if (data) {
                return res.status(200).json({
                    status: true,
                    message: 'user updated successfully'
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'user not updated'
                })
            }
        })
        .catch(err => {
            next(err.message);
        })
}


exports.getEnrollStudents = (req, res, next) => {
    studentModel.find({
        courseId: req.params.id
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
                    message: 'no enroll student'
                })
            }
        })
        .catch(err => {
            next(err.message)
        })
}

exports.sendTranscript = (req, res, next) => {
    const targetEmail = req.body.email;
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: targetEmail,
        subject: 'Transcript',
        text: process.env.Student_Transcript_URL + ', Code: 95942'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            next(error);
        }
        else {

            console.log('email sent successfully...');
            return res.status(200).send({
                status: true,
                message: 'Email sent '
            })
        }
    });
}

function courseDocumentData() {
    return {
        "status": true,
        "data": {
            "context": {
                "ceterms": "http://purl.org/ctdl/terms/",
                "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
                "res": "http://example.org/resources/",
                "xsd": "http://www.w3.org/2001/XMLSchema#"
            },
            "graph": [
                {
                    "id": "did:ethr:0x47968f7416ee34f62550fedf4cb8252439ac22d7",
                    "type": "ceterms:Course",
                    "creditUnitType": "school",
                    "ceterms:creditUnitValue": "123",
                    "ceterms:ctid": "4321",
                    "ceterms:prerequisite": "qweqwe",
                    "ceasn:hasChild": "String",
                    "ceterms:name": {
                        "language": "en-US",
                        "value": "schaool"
                    },
                    "ceterms:subjectWebpage": {
                        "id": "qweqw"
                    }
                },
                {
                    "id": "did:ethr:0x47968f7416ee34f62550fedf4cb8252439ac22d7",
                    "type": "ceterms:Course",
                    "creditUnitType": "school",
                    "ceterms:creditUnitValue": "123",
                    "ceterms:ctid": "4321",
                    "ceterms:prerequisite": "qweqwe",
                    "ceasn:hasChild": "String",
                    "ceterms:name": {
                        "language": "en-US",
                        "value": "schaaool"
                    },
                    "ceterms:subjectWebpage": {
                        "id": "qweqw"
                    }
                }
            ]
        }
    };
}
