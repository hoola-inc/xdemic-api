const mongoose = require('mongoose');

const ipfsSchema = mongoose.Schema({
    did: String,
    ipfsHash: String
}, {
    timestamps: true
});

module.exports = mongoose.model('ipfshash', ipfsSchema);