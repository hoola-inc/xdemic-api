module.exports = app => {
    const studentController = require('../controllers/student.controller');

    app.post('/student', studentController.addStudent);

    app.get('/student/:did', studentController.getSingleStudent);

    app.get('/students', studentController.getAllStudents);

    app.get('/studentjwt', studentController.getAllStudentsJWT);

    app.post('/credentials', studentController.sendCredentials);

    app.post('/studentmobile', studentController.addStudentFromMobile);

    app.get('/student/:id', studentController.getStudentById);

    app.put('/student/:id', studentController.updateStudents);

    app.get('/enrollstudents/:id', studentController.getEnrollStudents);

    app.post('/transscipt', studentController.sendTranscript);
};