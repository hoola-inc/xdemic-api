
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.model('OAuthUsers', new Schema({
    email: { type: String, default: '' },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    username: { type: String }
}));