module.exports = app => {
    const schoolController = require('../controllers/school-registration.controller');

    app.post('/school', schoolController.createNewSchool);
    app.get('/school', schoolController.getSchool);
};