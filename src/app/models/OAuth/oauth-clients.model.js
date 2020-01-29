
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.model('OAuthClient', new Schema({
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUris: { type: Array }
}, { timestamps: true }));

module.exports = mongoose.model('OAuthClient', CourseSchema);