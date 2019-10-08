const { Credentials } = require('uport-credentials');
const contants = require('../constants/main.constant');

const credentials = new Credentials(contants.credentials);


exports.jwtSchema = (did, data) => {
    return new Promise((resolve, reject) => {
        credentials.createVerification({
            sub: did,
            exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
            claim: data
        })
            .then(attestation => {
                resolve(attestation);
            })
            .catch(err => {
                reject(err.message);
            });
    })
}