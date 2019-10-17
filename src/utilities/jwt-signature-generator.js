const { Credentials } = require('uport-credentials');
const contants = require('../constants/main.constant');

const credentials = new Credentials(contants.credentials);

var d = new Date();
var year = d.getFullYear();
var month = d.getMonth();
var day = d.getDate();
var c = new Date(year + 1, month, day)

exports.jwtSchema = (did, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createJWT = await credentials.createVerification({
                sub: did,
                exp: c,
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