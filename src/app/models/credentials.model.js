const mongoose = require('mongoose');


const CredentialSchema = mongoose.Schema({
    did: String,
    privateKey: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Credential', CredentialSchema);