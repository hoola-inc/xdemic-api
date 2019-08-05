module.exports = app => {
    const uportLoginController = require('../controllers/xdemic-login.controller');

    app.post('/schoolemail', uportLoginController.createNewSchool);
    app.get('/pubkey', uportLoginController.exposePublucKey);
};