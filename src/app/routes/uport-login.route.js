module.exports = app => {
    const uportLoginController = require('../controllers/uport-login.controller');
    app.get('/uportlogin', uportLoginController.uportLogin);
    app.post('/callback', uportLoginController.uportLoginCallBack);
};
