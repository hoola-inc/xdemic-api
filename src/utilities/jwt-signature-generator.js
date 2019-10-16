const { Credentials } = require('uport-credentials');
const contants = require('../constants/main.constant');

const credentials = new Credentials(contants.credentials);


exports.jwtSchema = (did, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createJWT = await credentials.createVerification({
                sub: did,
                exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
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