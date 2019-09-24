const mongoose = require('mongoose');
const joi = require('joi');

const StudentSchema = mongoose.Schema({
    did: {
        type: String,
        required: true,
        unique: true
    },
    boxPub: String,
    name: String,
    dob: String,
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true
    },
    pushToken: String,
    courseId: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});



StudentSchema.pre("save", function(next) {
    var self = this;

    mongoose.models["Student"].findOne({did : this.did}, function(err, results) {
        if(err) {
            next(err);
        } else if(results) {
            console.warn('results');
            self.invalidate("did", "did must be unique");
            next(new Error("did must be unique"));
        } else {
            next();
        }
    });
});

module.exports = mongoose.model('Student', StudentSchema);