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

module.exports.proof = {
    proof: {
        "type": "ES256K",
        "created": "2017-06-18T21:19:10Z",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "did:example:ebfeb1f712ebc6f1c276e12ec21#key1",
        "jws": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..TCYt5XsITJX1CxPCT8yAV-TVkIEq_PbChOMqsLfRoPsnsgw5WEuts01mq-pQy7UJiN5mgRxD-WUcX16dUEMGlv50aqzpqh4Qktb3rk-BuQy72IFLOqV0G_zS245-kronKb78cPN25DGlcTwLtjPAYuNzVBAh4vGHSrQyHUdBBPM"
    }
}