const mongoose = require('mongoose');


const CourseSchema = mongoose.Schema({
        name: String,
        creditUnitType: String,
        creditUniteValue: String,
        ctid: String,
        subjectWebpage: String,
        prerequisite: String,
        uri: String,
        hasChild: String
}, {
                timestamps: true

        });

module.exports = mongoose.model('Course', CourseSchema);