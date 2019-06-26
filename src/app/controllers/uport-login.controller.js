const decodeJWT = require('did-jwt').decodeJWT;
const { Credentials } = require('uport-credentials');
const transports = require('uport-transports').transport;
const message = require('uport-transports').message.util;
const endpoint = require('../../constants/main.constant').BASE_URL;



// console.log(Credentials.createIdentity());
//setup Credentials object with newly created application identity.
const credentials = new Credentials({
    appName: 'Login Example',
    did: 'did:ethr:0x22c650129cfe54946a3fab6bde86808c78e35d94',
    privateKey: '655fe34d37989bfcf2d2f3dba9a1879c409f0d06042e3a88fc1ac74d73e471c6'
})

exports.uportLogin = (req, res) => {

    credentials.createDisclosureRequest({
        requested: ["name"],
        notifications: true,
        callbackUrl: endpoint + 'callback'
    })
        .then(requestToken => {
            console.log(decodeJWT(requestToken))  //log request token to console
            const uri = message.paramsToQueryString(message.messageToURI(requestToken), { callback_type: 'post' })
            console.log('URI ::: ', uri);
            const qr = transports.ui.getImageDataURI(uri)
            res.send(`<div><img src="${qr}"/></div>`)
        })
        .catch(err => {
            return res.status(200).json({
                status: false,
                message: err
            })
        })
};

exports.uportLoginCallBack = (req, res) => {
    const jwt = req.body.access_token
    console.log(jwt);
    credentials.authenticateDisclosureResponse(jwt)
        .then(credentials => {
            console.log(credentials);
            // Validate the information and apply authorization logic
            return res.status(200).json({
                status: true,
                creadentials: credentials
            })
        }).catch(err => {
            console.log(err)
            return res.status(200).json({
                status: false,
                message: err.message
            })
        })
}
