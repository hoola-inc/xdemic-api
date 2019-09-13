module.exports = app => {
    const schoolController = require('../controllers/school-registration.controller');

    app.post('/school', schoolController.createSchool);
    app.get('/school', schoolController.getSchool);
    app.get('/schoolwithjwt', schoolController.getSchoolWithSignedJWT);
};