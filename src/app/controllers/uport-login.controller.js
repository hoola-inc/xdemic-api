const decodeJWT = require('did-jwt').decodeJWT;
const { Credentials } = require('uport-credentials');
const transports = require('uport-transports').transport;
const message = require('uport-transports').message.util;
const endpoint = require('../../constants/main.constant').BASE_URL;



// console.log(Credentials.createIdentity());
//setup Credentials object with newly created application identity.
const credentials = new Credentials({
    appName: 'Login Example',
    did: 'did:ethr:0x31486054a6ad2c0b685cd89ce0ba018e210d504e',
    privateKey: 'ef6a01d0d98ba08bd23ee8b0c650076c65d629560940de9935d0f46f00679e01'
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
            // console.log('URI ::: ', uri);
            const qr = transports.ui.getImageDataURI(uri);
            // console.log(qr);
            res.send(`<div><img src="${qr}"/></div>`)

            // res.status(200).json({
            //     status: true,
            //     uri: uri
            // })
        })
        .catch(err => {
            return res.status(200).json({
                status: false,
                message: err
            })
        })
};

exports.uportLoginCallBack = (req, res) => {
    console.log('Token Access ::: ');
    console.log(req.body.access_token);
    const jwt = req.body.access_token;
    // console.log(jwt);
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
