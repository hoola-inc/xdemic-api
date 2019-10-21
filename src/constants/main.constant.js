module.exports.environment = {
    'BASE_URL': 'https://xdemic.herokuapp.com/'
};

module.exports.credentials = {
    appName: process.env.APP_NAME,
    did: process.env.SERVER_DID,
    privateKey: process.env.SERVER_PRIVATEKEY
};

module.exports.ipfsLink = {
    ipfsURL: process.env.IPFS_BASE_URL
};