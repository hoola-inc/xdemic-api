const courseModel = require('../../app/models/course.model');
const schoolSchema = require('../../app/models/school.model');


exports.addStudentInSchool = (studentDID) => {
    return new Promise((resolve, reject) => {

        console.log('Student DID ::: ', studentDID);

        schoolSchema.find()
            .then(data => {
                if (data.length > 0) {
                    const schoolId = data[0]._id;
                    console.log('School Id ::: ', schoolId);
                    schoolSchema.update({
                        _id: schoolId
                    }, {
                        $push: {
                            students: {
                                'studentDID': studentDID
                            }
                        }
                    })
                        .then(school => {
                            resolve('school updated');
                        })
                        .catch(err => {
                            reject(err);
                            return;
                        })
                }
            })
            .catch(err => {
                throw new Error(err);
            })
    })
}

exports.addCourseInSchool = (courseDID) => {

    return new Promise((resolve, reject) => {

        console.log('Course DID ::: ', courseDID);

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
                                'courseDID': courseDID
                            }
                        }
                    })
                        .then(school => {
                            resolve('school updated');
                        })
                        .catch(err => {
                            reject(err);
                            return;
                        })
                }
            })
            .catch(err => {
                throw new Error(err);
            })
    })

}

exports.updateStudentArrayInCourse = (studentDID, courseId) => {

    return new Promise((resolve, reject) => {
        schoolSchema.update({
            _id: courseId
        }, {
            $push: {
                students: {
                    'studentDID': studentDID
                }
            }
        })
            .then(course => {
                resolve('course updated');
            })
            .catch(err => {
                reject(err);
                return;
            })
    })
}