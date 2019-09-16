module.exports = app => {
    const studentController = require('../controllers/student.controller');

    app.get('/student', studentController.getStudents);
    app.get('/studentjwt', studentController.getStuentAsSignedJWT);
};