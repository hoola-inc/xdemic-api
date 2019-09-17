module.exports = app => {
    const courseController = require('../controllers/course.controller');

    app.post('/course', courseController.createNewCourse);

    app.get('/course', courseController.getAllCourses);

    app.get('/httpcourse', courseController.displayCourseOnHttp);

    app.get('/coursejwt', courseController.coursesWithJwt);
};