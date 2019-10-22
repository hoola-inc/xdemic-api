const mongoose = require('mongoose');


const SchoolRegSchema = mongoose.Schema({
    did: {
        type: String
    },
    type: {
        type: String,
        default: 'Issuer'
    },
    name: {
        type: String,
        default: 'Competency-Based University'
    },
    description: {
        type: String
    },
    url: {
        type: String,
        default: 'http://example.org/cbu'
    },
    address: {
        id: {
            type: String
        },
        type: {
            type: String,
            default: 'PostalAddress'
        },
        addressCountry: {
            type: String,
            default: 'France'
        },
        addressLocality: {
            type: String,
            default: 'Paris'
        },
        addressRegion: {
            type: String,
            default: 'Île-de-France'
        },
        postalCode: {
            type: String,
            default: 'F-75002'
        },
        postOfficeBoxNumber: {
            type: String
        },
        streetAddress: {
            type: String,
            default: '38 avenue de lOpera'
        }
    },
    email: {
        type: String,
        default: 'secretariat(at)google.org'
    },
    phone: {
        type: Number,
        default: '0000000000'
    },
    logo: {
        type: String
    },
    publicKey: {
        id: {
            type: String
        },
        type: {
            type: String
        },
        owner: {
            type: String
        },
        publicKeyPem: {
            type: String
        }
    },
    revocationList: {
        id: {
            type: String
        },
        type: {
            type: String
        },
        issuer: {
            type: String
        },
        revokedAssertions: [String]
    },
    sourcedId: String,
    url: String,
    verfication: {
        id: String,
        type: {
            type: String,
            default: 'Hosted'
        },
        allowedOrigins: [String],
        creator: String,
        startsWith: [String],
        verificationProperty: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('School', SchoolRegSchema);