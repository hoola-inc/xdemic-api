const mongoose = require('mongoose');

// TODO maybe depricated

const AdminSchema = mongoose.Schema({

    fullName: String,
    givenName: String,
    familyName: String,
    URL: {
        type: String,
        default: '',
    },
    pushToken: String,
    boxPub: String,
    birthDate: String,
    sourcedId: {
        type: String,
        default: '',
    },
    mobile: {
        type: String,
        required: [true, 'Why no mobile?'],
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, 'Why no email?'],
    },
    did: {
        type: String,
        required: [true, 'Why no DID?'],
        unique: true,
        index: true,
    },
    type: {
        type: String,
        default: 'Person',
    },
    gender: {
        type: String,
    },
    department: {
        type: String,
    },
}, {
    timestamps: true,
});


AdminSchema.pre("save", function (next) {
    const self = this;
    mongoose.models["Admin"].findOne({ did: this.did }, function (err, results) {
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


class AdminModel {
    // static async createAdmin(data) {
    //   await this.create(data);
    // }
}

AdminSchema.loadClass(AdminModel);
module.exports = mongoose.model('Admin', AdminSchema);
