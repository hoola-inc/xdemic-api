const mongoose = require('mongoose');


const SchoolSchema = mongoose.Schema({
        random_bytes_base64: String
}, {
        timestamps: true

});

module.exports = mongoose.model('SchoolRandomBytes', SchoolSchema);