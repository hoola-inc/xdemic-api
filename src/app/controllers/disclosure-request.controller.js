const decodeJWT = require('did-jwt').decodeJWT;
const { Credentials } = require('uport-credentials');
const transports = require('uport-transports').transport;
const message = require('uport-transports').message.util;
const qrImage = require('qr-image');

const credentials = new Credentials({
    appName: 'Xdemic',
    did: 'did:ethr:0xd741a6dd2711521e8798fbe92c12fcb9d2f43cf1',
    privateKey: '8986bea04ec687c45be90c5a6e259dbf125291f3a8ede0b595442c39d3322875'
});

exports.showQRCode = (req, res, next) => {
    credentials.createDisclosureRequest({
        requested: ["name"],
        notifications: true,
        callbackUrl:  'http://localhost:8200/disclosure/callback'
    })
    .then(requestToken => {
        console.log(decodeJWT(requestToken));  //log request token to console
        const uri = message.paramsToQueryString(message.messageToURI(requestToken), { callback_type: 'post' });
        const qr = transports.ui.getImageDataURI(uri); // todo cahnge here with google playstore link ...
        console.log(qr);
        res.send(`<div><img src="${qr}"/></div>`);
    })
    .catch(err => {
        next(err);
    });
}