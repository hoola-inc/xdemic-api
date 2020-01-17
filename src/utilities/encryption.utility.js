const nacl = require('tweetnacl');
const naclUtils = require('tweetnacl-util');
const { padEnd } = require('lodash');
const BLOCK_SIZE = process.env.BLOCK_SIZE;

const ASYNC_ENC_ALGORITHM = process.env.ASYNC_ENC_ALGORITHM;

exports.encryptMessage = async (message, boxPub) => {
    try {
        const secret = nacl.randomBytes(32);
        const { publicKey, secretKey } = nacl.box.keyPair.fromSecretKey(secret);
        const nonce = nacl.randomBytes(nacl.box.nonceLength);
        const padded = pad(message);
        const ciphertext = nacl.box(naclUtils.decodeUTF8(padded), nonce, naclUtils.decodeBase64(boxPub), secretKey);
        const sharedKey = nacl.box.before(naclUtils.decodeBase64(boxPub), secretKey);
        console.log('shared Key ::: ', naclUtils.encodeBase64(sharedKey));

        const encryptedData = {
            version: ASYNC_ENC_ALGORITHM,
            nonce: naclUtils.encodeBase64(nonce),
            ephemPubKey: naclUtils.encodeBase64(publicKey),
            ciphertext: naclUtils.encodeBase64(ciphertext)
        };

        console.log('Decrypt Message ::: ', decrypt(secretKey, foo));



        return encryptedData;
    } catch (error) {
        throw Error(error);
    }
}

function decrypt(receiverSecretKey, encryptedData) {
    const receiverSecretKeyUint8Array = naclUtils.decodeBase64(
        receiverSecretKey
    )
    const nonce = naclUtils.decodeBase64(encryptedData.nonce)
    const ciphertext = naclUtils.decodeBase64(encryptedData.ciphertext)
    const ephemPubKey = naclUtils.decodeBase64(encryptedData.ephemPubKey)
    const decryptedMessage = nacl.box.open(
        ciphertext,
        nonce,
        ephemPubKey,
        receiverSecretKeyUint8Array
    )
    return naclUtils.encodeUTF8(decryptedMessage)
}

function pad(message) {
    return padEnd(
        message,
        Math.ceil(message.length / BLOCK_SIZE) * BLOCK_SIZE,
        "\0"
    );
}