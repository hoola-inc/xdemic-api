const mongoose = require('mongoose');


const studentSchoolBridge = mongoose.Schema({
    schoolName: String,
    studentName: String,
    studentDid: String,
    schoolDid: String
}, {
    timestamps: true
});

module.exports = mongoose.model('StudentSchoolBridge', studentSchoolBridge);