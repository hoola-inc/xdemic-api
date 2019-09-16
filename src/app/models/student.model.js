const mongoose = require('mongoose');


const StudentSchema = mongoose.Schema({
    did: String,
    boxPub: String,
    name: String,
    dob: String,
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    pushToken: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema);