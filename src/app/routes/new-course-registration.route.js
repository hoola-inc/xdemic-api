module.exports = app => {
    const courseController = require('../controllers/new-course-registration.controller');

    app.post('/course', courseController.createNewCourse);
};