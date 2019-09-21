const mongoose = require('mongoose');


const StudentSchema = mongoose.Schema({
    did: String,
    boxPub: String,
    name: String,
    dob: String,
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    pushToken: String,
    courseId: mongoose.Schema.Types.ObjectId
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema);