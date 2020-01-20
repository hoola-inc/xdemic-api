module.exports = app => {
    const adminController = require('../controllers/admin.controller');

    app.get('/admin/qrcode', adminController.adminQRCode);
    app.get('/admin', adminController.getAllAdmins);
    app.get('/admin/:did', adminController.getSingleAdmin);

    // app.post('/newadmin', adminController.createAdminNew);
    // app.post('/callback', adminController.createAdmin);
};