const mongoose = require('mongoose');


const SchoolRegSchema = mongoose.Schema({
    name: String,
    subjectWebpage: String,
    address: String,
    offers: String,
    agentSectorType: String,
    agentType: String,
    email: String,
    did: String,
    telephone: String
}, {
    timestamps: true
});

module.exports = mongoose.model('School', SchoolRegSchema);