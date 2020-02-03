const mongoose = require('mongoose');

const PersonSchema = mongoose.Schema({

    fullName: String,
    givenName: String,
    familyName: String,
    url: {
        type: String,
        default: ''
    },
    pushToken: String,
    boxPub: String,
    birthDate: String,
    sourcedId: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        required: [true, 'Why no mobile?'],
        trim: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        // required: [true, 'Why no email?']
    },
    did: {
        type: String,
        default: ''
        // required: [true, 'Why no DID?'],
        // unique: true,
        // index: true
    },
    gender: {
        type: String,
        // required: [true, 'Why no gender?']
    },
    type: {
        type: String,
        default: 'Person'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['Admin', 'Employee'],
        default: 'Admin'
    },
    department: String
}, {
    timestamps: true
});

class PersonModel {
    static async createPerson(data) {
        return await this.create(data);
    }

    static async getAllPersons() {
        return await this.find();
    }

    static async getSinglePerson(obj) {
        return await this.find(obj);
    }
}



PersonSchema.pre("save", function (next) {
    const self = this;
    mongoose.models["Person"].findOne({ mobile: this.mobile }, function (err, results) {
        if (err) {
            next(err);
        } else if (results) {
            console.log('mobile number must be unique');
            self.invalidate("mobile", "mobile number must be unique");
            next("mobile number must be unique");
        } else {
            next();
        }
    });
});

PersonSchema.loadClass(PersonModel);
module.exports = mongoose.model('Person', PersonSchema);