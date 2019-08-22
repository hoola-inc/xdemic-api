const CourseSchema = require('../models/new-course-registration.model');


exports.createNewCourse = (req, res, next) => {
    const newCourse = new CourseSchema(req.body);

    newCourse.save()
    .then(data => {
        return res.status(200).json({
            status: true,
            data: data
        })
    })
    .catch(err => {
        next(err.message);
    })
}

const schemaExist = (data) => {

}