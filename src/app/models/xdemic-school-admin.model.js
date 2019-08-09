const mongoose = require('mongoose');


const StudentSchema = mongoose.Schema({
        name: String,
        date_of_birth: String,
        phone: String,
        id: String,
        email: String
}, {
        timestamps: true

});

module.exports = mongoose.model('Student', StudentSchema);