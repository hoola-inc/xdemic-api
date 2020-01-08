const mongoose = require('mongoose');

const PersonSchema = mongoose.Schema({

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
        required: [true, 'Why no mobile?']
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, 'Why no email?']
    },
    did: {
        type: String,
        required: [true, 'Why no DID?'],
        unique: true,
        index: true
    },
    gender: {
        type: String,
        required: [true, 'Why no gender?']
    },
    type: {
        type: String,
        default: 'Person'
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});



PersonSchema.pre("save", function (next) {
    const self = this;

    mongoose.models["Person"].findOne({ did: this.did }, function (err, results) {
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

module.exports = mongoose.model('Person', PersonSchema);