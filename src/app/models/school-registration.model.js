const mongoose = require('mongoose');


const SchoolRegSchema = mongoose.Schema({
    schoolName: String,
    logo: String,
    contactInfo: [],
    brandedUrl: String
}, {
    timestamps: true
});

module.exports = mongoose.model('SchoolRegistration', SchoolRegSchema);