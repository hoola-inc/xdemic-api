const jwt = require('jsonwebtoken');

jwt.sign({
    // payload go here ...
}, 'secret goes here', 'expiry goes here ...')