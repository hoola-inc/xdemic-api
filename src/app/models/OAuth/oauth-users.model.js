
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.model('OAuthUser', new Schema({
    email: { type: String, default: '' },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    username: { type: String }
}, { timestamps: true }));

module.exports = mongoose.model('OAuthUser', CourseSchema);