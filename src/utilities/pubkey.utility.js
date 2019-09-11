const decodeJWT = require('did-jwt').decodeJWT;
const { Credentials } = require('uport-credentials');
const transports = require('uport-transports');
const message = require('uport-transports').message.util;
const path = require('path');
const fs = require('fs');
const nacl = require('tweetnacl');
const naclUtils = require('../../node_modules/tweetnacl-util');
const btoa = require('btoa');
const util= require('util');
const resolve = require('did-resolver');
const registerResolver = require('https-did-resolver');

const identity = {
    did: 'did:ethr:0xd741a6dd2711521e8798fbe92c12fcb9d2f43cf1',
    privateKey:
        '8986bea04ec687c45be90c5a6e259dbf125291f3a8ede0b595442c39d3322875'
}
// console.log(naclUtils.decodeBase64(identity.privateKey.toString('base64')));
// const { publicKey, secretKey } = nacl.box.keyPair.fromSecretKey())

// const menemonics = bip39.generateMnemonic();
// console.log(menemonics);






// function lengthInUtf8Bytes(str) {
//     // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
//     const m = encodeURIComponent(str).match(/%[89ABab]/g);
//     return str.length + (m ? m.length : 0);
// }

// // console.log(stringToUint(identity.privateKey));

// // console.log(identity.privateKey);
// // const key32Bytes = nacl.randomBytes(32);
// // console.log(key32Bytes.length)
// function stringToUint(string) {
//     let newString = btoa(unescape(encodeURIComponent(string))),
//         charList = newString.split(''),
//         uintArray = [];
//     for (let i = 0; i < charList.length; i++) {
//         uintArray.push(charList[i].charCodeAt(0));
//     }
//     return new Uint8Array(uintArray);
// }
// // const utf8Array = stringToUint(identity.privateKey);
// // console.log(utf8Array.length);

// // const d = base32.decode(identity.privateKey);

// // console.log(new util.TextEncoder("utf-8").encode(base32.encode(d)).length);

// // const prvKeyBase64 = naclUtils.encodeBase64(utf8Array);
// // const decodedPrvBase64 = naclUtils.decodeBase64(prvKeyBase64);
// // console.log(decodedBase64);
// // const { publicKey, secretKey } = nacl.box.keyPair.fromSecretKey(new util.TextEncoder("utf-8").encode(base32.encode(identity.privateKey)));

// // console.log(naclUtils.encodeBase64(publicKey));
// // console.log(naclUtils.encodeBase64(secretKey));





// // const hexString = identity.privateKey;

// // const fromHexString = hexString =>
// //     new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

// // const encryptionKeyPair = nacl.box.keyPair.fromSecretKey(fromHexString('')).secretKey;
// // console.log(encryptionKeyPair);

// // console.log(transports.crypto.encryptMessage());

// // resolve('did:https:example.com').then(doc => console.log)

// // const key32Bytes = nacl.randomBytes(32);
// // const { publicKey, secretKey } = nacl.box.keyPair.fromSecretKey(key32Bytes);


// // module.exports = {
// //     publicKey: naclUtils.encodeBase64(publicKey),
// //     secretKey: naclUtils.encodeBase64(secretKey)
// // }


