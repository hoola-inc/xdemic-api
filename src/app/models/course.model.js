const mongoose = require('mongoose');


const CourseSchema = mongoose.Schema({
        name: String,
        creditUnitType: String,
        creditUniteValue: String,
        ctid: String,
        subjectWebpage: String,
        prerequisite: String,
        uri: String,
        hasChild: String,
        courseCode: {
                type: String,
                default: ''
        },
        courseGrade: {
                type: String, 
                default: ''
        },
        courseGPA: {
                type: String,
                default: ''
        },
        coursePercentage: {
                type: String,
                default: ''
        },
        schoolName: {
                type: String,
                default: ''
        }, 
        students: [{
                studentDID: String
        }]
}, {
        timestamps: true

});

module.exports = mongoose.model('Course', CourseSchema);