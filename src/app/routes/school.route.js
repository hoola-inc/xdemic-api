module.exports = app => {
    const schoolController = require('../controllers/school.controller');
    const uploadImage = require('../../utilities/multer.utilituy');

    app.post('/school', uploadImage, schoolController.createSchool);

    app.get('/schools', schoolController.getSchool);

    app.get('/schoolwithjwt', schoolController.getSchoolWithSignedJWT);

    app.get('/schoolwithstudentenroll/:did', schoolController.getSchoolWithStudent);

};