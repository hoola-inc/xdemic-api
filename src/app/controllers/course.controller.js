const CourseSchema = require('../models/course.model');
const fs = require('fs');


exports.createNewCourse = async (req, res, next) => {
    const course = await courseExist(req);
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
}

const courseExist = async (req) => {
    const checkCourse = await CourseSchema.find({
        course_name: req.body.course_name
    });
    if (checkCourse.length > 0) {
        return true
    } else {
        return false;
    }
}

const writeToFile = (courseData, res) => {
    const path = require('path').join(__dirname, '../../../http-files/course.json');
    fs.readFile(path, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            writeToFileObj(courseData);
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile(path, json, 'utf8', (err) => {
                if (err) {
                    throw new Error('Error occured while writing to file')
                } else {
                    return res.status(200).json({
                        status: true,
                        message: "Successfully created and write to file"
                    })
                }
            }); // write it back
        }
    });
}

exports.getAllCourses = (req, res, next) => {
    CourseSchema.find()
        .then(data => {
            if (data.length > 0) {
                return res.status(200).json({
                    status: true,
                    data: data
                })
            } else {
                return res.status(200).json({
                    status: false,
                    data: 'record not found'
                })
            }
        })
        .catch(err => {
            next(err.message);
        })
}

exports.displayCourseOnHttp = (req, res, next) => {
    const path = require('path').join(__dirname, '../../../http-files/course.json');
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