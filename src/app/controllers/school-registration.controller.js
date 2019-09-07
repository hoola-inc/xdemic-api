const SchoolSchema = require('../models/school-registration.model');
const sendJWt = require('../../utilities/send-signed-jwt.utility');



exports.createNewSchool = (req, res, next) => {

    console.log(req.body);
    const newSchool = new SchoolSchema(req.body);

    newSchool.save()
        .then(data => {
            return res.status(200).json({
                status: true,
                data: data
            })
        })
        .catch(err => {
            next(err.message);
        })
}

exports.getSchool = (req, res, next) => {
    SchoolSchema.find()
        .then(data => {
            if (data.length > 0) {
                sendJWt.sendSchoolSchema('did:ethr:0xa056ffbfd644e482ad8d722c4be4c66aa052ad5a', data)
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

