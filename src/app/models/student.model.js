const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({

    fullName: String,
    givenName: String,
    familyName: String,
    URL: String,
    pushToken: String,
    boxPub: String,
    birthDate: String,
    sourcedId: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true
    },
    did: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        default: 'Person'
    },

    courseId: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});



StudentSchema.pre("save", function (next) {
    const self = this;

    mongoose.models["Student"].findOne({ did: this.did }, function (err, results) {
        if (err) {
            next(err);
        } else if (results) {
            console.log('did must be unique');
            self.invalidate("did", "did must be unique");
            next(new Error("did must be unique"));
        } else {
            next();
        }
    });
});

module.exports = mongoose.model('Student', StudentSchema);