const courseController = require('../controllers/course.controller');

module.exports = (app) => {
  app.post('/course', courseController.createNewCourse);
  app.get('/course/:did', courseController.getCourseByDID);
  app.get('/courses', courseController.getAllCourses);
};
