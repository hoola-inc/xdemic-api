const CourseSchema = require('../models/course.model');
const fs = require('fs');
const sendJWt = require('../../utilities/send-signed-jwt.utility');


exports.createNewCourse = async (req, res, next) => {
    const course = await courseExist(req);
    try {
        if (course) {
            return res.status(200).json({
                status: false,
                message: 'course already exist'
            })
        } else {
            const newCourse = new CourseSchema(req.body);
            newCourse.save()
                .then(data => {
                    writeToFile(data, res);
                })
                .catch(err => {
                    next(err.message);
                })
        }
    } catch (error) {
        next(error.message);
    }
}

const courseExist = async (req) => {
    try {
        const checkCourse = await CourseSchema.find({
            name: req.body.name
        });
        if (checkCourse.length > 0) {
            return true
        } else {
            return false;
        }
    } catch (error) {
        throw new Error('an error occured while fetching courses from db', error.message);
    }
}

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

exports.getAllCourses = (req, res, next) => {
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