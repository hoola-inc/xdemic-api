module.exports = app => {
    const schoolController = require('../controllers/school.controller');

    app.post('/school', schoolController.createSchool);

    app.get('/schools', schoolController.getSchool);

    app.get('/schoolwithjwt', schoolController.getSchoolWithSignedJWT);

    app.get('/schoolwithstudentenroll/:did', schoolController.getSchoolWithStudent);

    app.put('/favschool/:did', schoolController.updateFavSchoolArray);

    app.get('/favschools/:did', schoolController.getfavoriteSchools);
};