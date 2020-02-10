const mongoose = require('mongoose');
/**
 * Schema design according to CLR
 * find more here https://www.imsglobal.org/sites/default/files/spec/clr/v1p0/InfoModel/clr_InfoModel.html#Data_Profile
 */

const PersonSchema = mongoose.Schema({
    type: {
        type: String,
        default: 'Person'
    },
    address: {
        id: {
            type: String
        },
        type: {
            type: String,
            default: 'Person'
        },
        addressCountry: {
            type: String,
            default: ''
        },
        addressLocality: {
            type: String,
            default: ''
        },
        addressRegion: {
            type: String,
            default: ''
        },
        postalCode: {
            type: String,
            default: ''
        },
        postOfficeBoxNumber: {
            type: String,
            default: ''
        },
        streetAddress: {
            type: String,
            default: ''
        },
    },
    description: String,
    endorsements: {
        id: String,
        type: {
            type: String
        },
        claim: String,
        issuedOn: {
            type: Date,
            default: Date.now()
        },
        issuer: String,
        revocationReason: {
            type: String,
            default: ''
        },
        revoked: {
            type: String,
            default: ''
        },
        verification: String,
    },
    email: {
        type: String,
        required: [true, 'Why no email'],
    },
    image: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        required: [true, 'Why no name'],
    },
    publicKey: {
        id: {
            type: String
        },
        type: {
            type: String
        },
        owner: String,
        publicKeyPem: String,
    },
    revocationList: String,
    sourcedId: {
        type: {
            type: String
        },
        default: ''
    },
    studentId: {
        type: {
            type: String
        },
        default: '',
    },
    telephone: {
        type: String,
        unique: true,
        required: [true, 'Why no telephone'],
        index: true,
    },
    url: {
        type: String
    },
    verification: {
        id: String,
        type: {
            type: String
        },
        allowedOrigins: String,
        creator: String,
        startsWith: String,
        verificationProperty: String,
    },
    extensions: {
        role: {
            type: String,
            enum: ['Employee', 'Admin', 'Student'],
            default: 'Admin'
        }
    }
}, {
    timestamps: true
});

class PersonModel {
    static async createPerson(data) {
        return await this.create(data);
    }

    static async getAllPersons(obj) {
        return await this.find();
    }

    static async getSinglePerson(obj) {
        return await this.find(obj);
    }
}



PersonSchema.pre("save", function (next) {
    const self = this;
    mongoose.models["Person"].findOne({ telephone: this.telephone }, function (err, results) {
        if (err) {
            next(err);
        } else if (results) {
            console.log('telephone number must be unique');
            self.invalidate("telephone", "telephone number must be unique");
            next("telephone number must be unique");
        } else {
            next();
        }
    });
});

PersonSchema.loadClass(PersonModel);
module.exports = mongoose.model('Person', PersonSchema);