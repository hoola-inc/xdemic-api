const { Credentials } = require('uport-credentials');
const contants = require('../constants/main.constant');

const credentials = new Credentials(contants.credentials);

exports.jwtSchema = (did, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createJWT = await credentials.createVerification({
                sub: did,
                // TODO If your information is not permanent make sure to add an expires timestamp
                // exp: c
                claim: data
            });
            if (createJWT) {
                resolve(createJWT);
            }
        } catch (error) {
            reject(error);
        }
    });
};