const mongoose = require('mongoose');

const PersonSchema = mongoose.Schema({
    id: String,
    type: String,
    address: {
        id: String,
        type: String,
        addressCountry: String,
        addressLocality: String,
        addressRegion: String,
        postalCode: String,
        postOfficeBoxNumber: String,
        streetAddress: String,
    },
    description: String,
    endorsements: {
        id: String,
        type: String,
        claim: String,
        issuedOn: String,
        issuer: String,
        revocationReason: String,
        revoked: String,
        verification: String,
    },
    email: String,
    image: String,
    name: String,
    publicKey: {
        id: String,
        type: String,
        owner: String,
        publicKeyPem: String,
    },
    revocationList: String,
    sourcedId: String,
    studentId: String,
    telephone: String,
    url: String,
    verification: {
        id: String,
        type: String,
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