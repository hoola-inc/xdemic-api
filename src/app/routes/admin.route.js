module.exports = app => {
    const adminController = require('../controllers/admin.controller');

    app.get('/adminQRCode', adminController.adminQRCode);
    app.post('/callback', adminController.createAdmin);
};