const CredentialModel = require('../app/models/credentials.model');
const { Credentials } = require('uport-credentials');

exports.saveCredentials = async () => {
    try {
        const { did, privateKey } = Credentials.createIdentity();
        if (did && privateKey) {
            const saveNewCredentials = new CredentialModel({
                did: did,
                privateKey: privateKey
            });
            const createNewCredentials = await saveNewCredentials.save();
            if (createNewCredentials) {
                return {
                    did: did,
                    privateKey: privateKey
                };
            } else {
                throw new Error('An error occured while creating new Credentials');
            }
        } else {
            throw new Error('did not found');
        }
    } catch (error) {
        throw new Error(error);
    }
};