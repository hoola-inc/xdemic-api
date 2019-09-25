module.exports = app => {
    const courseController = require('../controllers/course.controller');

    app.post('/course', courseController.createNewCourse);

    app.get('/courses/:did', courseController.getAllCourses);

    app.get('/httpcourse', courseController.displayCourseOnHttp);

    app.get('/coursejwt', courseController.coursesWithJwt);

    app.get('/course/:id', courseController.getCourseById);

    app.put('/course/:id', courseController.updateCourseGrade);
};