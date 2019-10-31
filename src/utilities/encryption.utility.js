const nacl = require('tweetnacl');
const naclUtils = require('tweetnacl-util');

const BLOCK_SIZE = process.env.BLOCK_SIZE;

const ASYNC_ENC_ALGORITHM = process.env.ASYNC_ENC_ALGORITHM;

exports.encryptMessage = async (message, boxPub) => {
    const secret = nacl.randomBytes(32);
    const { publicKey, secretKey } = nacl.box.keyPair.fromSecretKey(secret);
    const nonce = nacl.randomBytes(24);
    const padded = pad(message);
    const ciphertext = nacl.box(naclutil.decodeUTF8(padded), naclutil.decodeBase64(nonce.toString('base64')), naclutil.decodeBase64(boxPub), secretKey);

    console.log(naclUtils.encodeBase64(publicKey), naclUtils.encodeBase64(secretKey));

    return {
        version: ASYNC_ENC_ALGORITHM,
        nonce: naclutil.encodeBase64(nonce),
        ephemPublicKey: naclutil.encodeBase64(publicKey),
        ciphertext: naclutil.encodeBase64(ciphertext)
    }
}

function pad(message) {
    return padEnd(
        message,
        Math.ceil(message.length / BLOCK_SIZE) * BLOCK_SIZE,
        "\0"
    );
}

