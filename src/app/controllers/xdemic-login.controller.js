const nacl = require('tweetnacl');
const naclUtils = require('../../../node_modules/tweetnacl-util');
const SchoolModel = require('../models/xdemic-login.model')

exports.createNewSchool = (req, res) => {

    // matching email ...
    if (req.body.email.toString().trim() === 'demo@xdemic.com') {

        // generating 32 bytes random key return Uint8Array
        const randomKey = nacl.randomBytes(32);
        const encodedBase64 = naclUtils.encodeBase64(randomKey);

        // initializing model obj
        let newSchool = new SchoolModel({
            random_bytes_base64: encodedBase64
        });

        // saving in db...
        newSchool.save()
            .then(data => {
                return res.status(200).json({
                    success: true,
                    data: data
                })
            })
            .catch(err => {
                return res.status(200).json({
                    success: false,
                    data: err.message
                })
            })
    } else {
        return res.status(200).send({
            success: false,
            message: 'email not matched'
        })
    }
}


exports.exposePublucKey = (req, res) => {
    SchoolModel.find()
        .then(data => {
            console.log(data[0].random_bytes_base64)
            const decodedBase64 = naclUtils.decodeBase64(data[0].random_bytes_base64);
            const keys = nacl.box.keyPair.fromSecretKey(decodedBase64)
            console.log(keys);
            return res.status(200).send({
                success: true,
                data: naclUtils.encodeBase64(keys.publicKey)
            })
        })
        .catch(err => {
            return res.status(200).json({
                success: false,
                data: err.message
            })
        })
}

