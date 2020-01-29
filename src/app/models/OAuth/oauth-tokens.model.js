
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.model('OAuthToken', new Schema({
    accessToken: { type: String },
    accessTokenExpiresOn: { type: Date },
    client: { type: Object },  // `client` and `user` are required in multiple places, for example `getAccessToken()`
    clientId: { type: String },
    refreshToken: { type: String },
    refreshTokenExpiresOn: { type: Date },
    user: { type: Object },
    userId: { type: String },
}, { timestamps: true }));

module.exports = mongoose.model('OAuthToken', CourseSchema);