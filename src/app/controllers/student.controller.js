const studentModel = require('../models/student.model');
const sendJWt = require('../../utilities/send-signed-jwt.utility');

exports.getStudents = (req, res, next) => {
    studentModel.find()
        .then(data => {
            if(data.length > 0) {
                return res.status(200).json({
                    status: true,
                    length: data.length,
                    data: data
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'student not found'
                })
            }
        })
}

exports.getStuentAsSignedJWT = (req, res, next) => {
    studentModel.find()
        .then(data => {
            if (data.length > 0) {
                sendJWt.jwtSchema('did:ethr:0xa056ffbfd644e482ad8d722c4be4c66aa052ad5a', data)
                    .then(signedJwt => {
                        return res.status(200).send({
                            status: true,
                            data: signedJwt
                        })
                    })
                    .catch(err => {
                        next(err.message)
                    })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'no record found'
                });
            }
        })
        .catch(err => {
            next(err.message);
        })
}