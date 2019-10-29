const { Credentials } = require('uport-credentials');
const serverCredentials = require('../constants/main.constant').credentials;

const credentials = new Credentials(serverCredentials);

module.exports = {
    credentials: credentials
}

