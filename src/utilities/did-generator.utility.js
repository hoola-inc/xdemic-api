const { Credentials } = require('uport-credentials');

let { did, privateKey } = Credentials.createIdentity();

module.exports = {
    did: did,
    privateKey: privateKey
}