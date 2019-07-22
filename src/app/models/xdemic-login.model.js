const mongoose = require('mongoose');


const SchoolSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    phone_number: {
        type: String,
        required: true
    }
}, {
        timestamps: true

    });

module.exports = mongoose.model('School', SchoolSchema);