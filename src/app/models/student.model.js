const mongoose = require('mongoose');


const StudentSchema = mongoose.Schema({
    did: String,
    boxPub: String,
    name: String,
    dob: String,
    phone: String,
    email: {
        type: String,
        unique: true,
        require: true
    },
    pushToken: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema);