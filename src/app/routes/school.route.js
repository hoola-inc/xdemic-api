module.exports = app => {
    const schoolController = require('../controllers/school.controller');

    app.post('/school', schoolController.createSchool);
    app.get('/school', schoolController.getSchool);
    app.get('/schoolwithjwt', schoolController.getSchoolWithSignedJWT);

    app.get('/httpschool', schoolController.displaySchoolOnHttp);
};