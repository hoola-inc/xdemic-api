module.exports = app => {
    const studentController = require('../controllers/student.controller');

    app.get('/student', studentController.getStudents);
    app.get('/studentjwt', studentController.getStuentAsSignedJWT);

    app.post('/credentials', studentController.sendCredentials);

    app.post('/studentmobile', studentController.addStudentFromMobile);

    app.get('/student/:id', studentController.getStudentById);

    app.put('/student/:id', studentController.updateStudents);

    app.get('/enrollstudents/:id', studentController.getEnrollStudents);

    app.post('/transscipt', studentController.sendTranscript);
};