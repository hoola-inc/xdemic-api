const nacl = require('tweetnacl');
const naclUtils = require('tweetnacl-util');
const SchoolModel = require('../models/xdemic-login.model');
const nodemailer = require('nodemailer');

exports.createNewSchool = (req, res, next) => {

    // matching email ...
    if (req.body.email.toString().trim() === 'demo@xdemic.com') {

        // generating 32 bytes random key return Uint8Array
        const randomKey = nacl.randomBytes(32);
        const encodedBase64 = naclUtils.encodeBase64(randomKey);

        // initializing model obj
        const newSchool = new SchoolModel({
            random_bytes_base64: encodedBase64
        });

        // saving in db...
        newSchool.save()
            .then(data => {
                return res.status(200).json({
                    success: true,
                    data: data
                });
            })
            .catch(err => {
                next(err);  // Pass errors to Express.
            })
    } else {
        throw new Error('email not found') // Express will catch this on its own.
    }
}


exports.exposePublucKey = (req, res, next) => {
    SchoolModel.find()
        .then(data => {
            console.log(data[0].random_bytes_base64)
            const decodedBase64 = naclUtils.decodeBase64(data[0].random_bytes_base64);
            const keys = nacl.box.keyPair.fromSecretKey(decodedBase64)
            console.log(keys);
            return res.status(200).json({
                success: true,
                data: naclUtils.encodeBase64(keys.publicKey)
            })
        })
        .catch(err => {
            next(err);
        })
}


exports.sendEmail = (req, res, next) => {
    const targetEmail = req.body.email;
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: targetEmail,
        subject: 'Selective Disclosure Request',
        text: process.env.BASE_URL.concat('qrcode')
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            next(error);
        }
        else {

            console.log('email sent successfully...');
            return res.status(200).send({
                status: true,
                message: 'Email sent '
            })
        }
    });
}


