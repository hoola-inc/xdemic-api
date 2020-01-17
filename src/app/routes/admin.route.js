module.exports = app => {
    const adminController = require('../controllers/admin.controller');

    app.get('/adminQRCode', adminController.adminQRCode);
    app.get('/admin', adminController.getAllAdmins);
    app.get('/admin/:did', adminController.getSingleAdmin);
    // app.post('/callback', adminController.createAdmin);
};