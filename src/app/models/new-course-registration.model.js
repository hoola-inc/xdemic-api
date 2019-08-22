const mongoose = require('mongoose');


const CourseSchema = mongoose.Schema({
        course_name: String,
        course_code: String,
        course_description: String,
        grading_schema: String,
        tags: String,
        issuer: String,
        allignment: String
}, {
                timestamps: true

        });

module.exports = mongoose.model('Course', CourseSchema);