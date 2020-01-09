
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.model('OAuthClients', new Schema({
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUris: { type: Array }
}));
