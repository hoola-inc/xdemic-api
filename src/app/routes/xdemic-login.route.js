module.exports = app => {
    const uportLoginController = require('../controllers/xdemic-login.controller');
    app.post('/school', uportLoginController.createNewSchool);
    app.get('/yo', uportLoginController.yo);
};
