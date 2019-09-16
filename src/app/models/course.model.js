const mongoose = require('mongoose');


const CourseSchema = mongoose.Schema({
        audienceLevelType: String,
        audienceType: String,
        codedNotation: String,
        credentialId: String,
        credentialStatusType: String,
        dateEffective: String,
        inLanguage: String,
        isRequiredFor: String,
        jurisdiction: String,
        latestVersion: String,
        learningDeliveryType: String,
        name: String,
        offeredBy: String,
        offeredIn: String,
        ownedBy: String,
        previousVersion: String,
        regulatedBy: String,
        regulatedIn: String,
        requires: String,
        revocation: String,
        revocationProcess: String,
        versionIdentifier: String
}, {
                timestamps: true

        });

module.exports = mongoose.model('Course', CourseSchema);