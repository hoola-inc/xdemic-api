const CourseSchema = require('../models/course.model');
const schoolSchema = require('../models/school.model');
const fs = require('fs');
const sendJWt = require('../../utilities/jwt-signature-generator');
const saveCredentials = require('../../utilities/save-credentials');
const writeFile = require('../../utilities/write-to-file.utility');
const addToIPFS = require('../../utilities/ipfs-add-file.utility');
const ipfsLink = require('../../constants/main.constant').ipfsLink;


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
            // waiting to write file with new course data
            const isWritten = await writeFile.writeToFile(did, 'courses', createNewCourse);
            if (isWritten) {
                // hosting to ipfs 
                const path = require('path').join(__dirname, `../../../http-files/courses/${did}.json`);
                const ipfsFileHash = await addToIPFS.addFileIPFS(did, path);
                if (fileHash) {
                    console.log(ipfsLink.ipfsURL);
                    return res.status(200).json({
                        status: true,
                        data: createNewCourse,
                        ipfs: ipfsLink.ipfsURL + ipfsFileHash
                    })
                } else {
                    throw new Error('An error occured while hosting file to ipfs');
                }
            } else {
                throw new Error('An error occured while writing course to the file');
            }
        } else {
            throw new Error('An error occured while creating new course');
        }
    } catch (error) {
        next(error);
    }
};

const writeToFile = (courseData, res) => {
    try {
        const path = require('path').join(__dirname, '../../../http-files/courses/course.json');
        fs.readFile(path, 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                obj = JSON.parse(data); //now it an object
                writeObjToFile(obj, courseData);
                json = JSON.stringify(obj); //convert it back to json
                fs.writeFile(path, json, 'utf8', (err) => {
                    if (err) {
                        throw new Error('Error occured while writing to file')
                    } else {
                        return res.status(200).json({
                            status: true,
                            courseData: courseData,
                            courseHostURL: process.env.BASE_URL + "httpcourse",
                            message: "Successfully created and write to file"
                        })
                    }
                }); // write it back
            }
        });
    } catch (error) {
        throw new Error('an error occured while parsing json course file', error.message);
    }
}

const writeObjToFile = (obj, courseData) => {
    let courseFileObj = {
        "id": "did:ethr:0x47968f7416ee34f62550fedf4cb8252439ac22d7",
        "type": "ceterms:Course",
        "creditUnitType": courseData.creditUnitType,
        "ceterms:creditUnitValue": courseData.creditUniteValue,
        "ceterms:ctid": courseData.ctid,
        "ceterms:prerequisite": courseData.prerequisite,
        "ceasn:hasChild": courseData.hasChild,
        "ceterms:name": {
            "language": "en-US",
            "value": courseData.name
        },
        "ceterms:subjectWebpage": {
            "id": courseData.subjectWebpage
        }
    }
    obj.graph.push(courseFileObj);
}

exports.getCoursesForDashboard = (req, res, next) => {
    CourseSchema.find()
        .then(data => {
            if (data.length > 0) {
                // todo change here ...
                data.map((e) => {
                    e.courseGrade = "C",
                        e.courseGPA = "2",
                        e.coursePercentage = "50.55%",
                        e.schoolName = " US National School"
                })
                // end here ...
                return res.status(200).json({
                    status: true,
                    length: data.length,
                    data: data
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'record not found'
                })
            }
        })
        .catch(err => {
            console.log(err);
            next(err.message);
        })
}

exports.getAllCourses = (req, res, next) => {

    console.log(req.params.did);
    schoolSchema.find({
        "student.studentDID": req.params.did
    })
        .then(data => {
            console.log(data);
            if (data.length > 0) {
                CourseSchema.find({
                    "students.studentDID": req.params.did
                })
                    .then(studentCourse => {
                        if (studentCourse.length > 0) {
                            CourseSchema.find()
                                .then(data => {
                                    if (data.length > 0) {
                                        // todo change here ...
                                        data.map((e) => {
                                            e.courseGrade = "C",
                                                e.courseGPA = "2",
                                                e.coursePercentage = "50.55%",
                                                e.schoolName = " US National School"
                                        })
                                        // end here ...
                                        return res.status(200).json({
                                            status: true,
                                            length: data.length,
                                            data: data
                                        })
                                    } else {
                                        return res.status(200).json({
                                            status: false,
                                            message: 'record not found'
                                        })
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    next(err.message);
                                })
                        } else {
                            return res.status(200).json({
                                status: false,
                                message: 'no studnet enroll'
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        next(err.message);
                    })


            } else {
                return res.status(200).json({
                    status: false,
                    message: 'student is not enroll with school yet'
                })
            }
        })
        .catch(err => {
            next(err.message);
        })
}

exports.displayCourseOnHttp = (req, res, next) => {
    const path = require('path').join(__dirname, '../../../http-files/courses/course.json');
    const fileContents = fs.readFileSync(path, 'utf8');
    try {
        const data = JSON.parse(fileContents);
        return res.status(200).json({
            status: true,
            data: data
        })
    } catch (err) {
        next(err.message);
    }
}

exports.coursesWithJwt = (req, res, next) => {
    CourseSchema.find()
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
