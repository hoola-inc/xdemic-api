const mongoose = require('mongoose');


const SchoolRegSchema = mongoose.Schema({
    name: String,
    address: String,
    email: String,
    subjectWebpage: String,
    agentSectorType: String,
    agentType: String,
    description: String,
    did: String
}, {
    timestamps: true
});

module.exports = mongoose.model('School', SchoolRegSchema);