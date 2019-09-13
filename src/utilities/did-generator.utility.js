const { Credentials } = require('uport-credentials');

const { did, privateKey } = Credentials.createIdentity();

module.exports = {
    did: did,
    privateKey: privateKey
}