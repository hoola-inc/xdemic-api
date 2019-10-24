const courseModel = require('../../app/models/course.model');
const schoolModel = require('../../app/models/school.model');


exports.updateStudentArrayInSchool = (studentDID) => {
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

exports.updateCourseArrayInSchool = () => {

}

exports.updateStudentArrayInCourse = () => {

}