module.exports = app => {
    const uportLoginController = require('../controllers/uport-login.controller');
    app.post('/school', uportLoginController.createNewSchool);
};
