module.exports = app => {
    const disclosureController = require('../controllers/disclosure-request.controller');
    app.get('/qrcode', disclosureController.showQRCode);
    app.post('/callback', disclosureController.varifyClaims);

    // app.post('/notificationsubscription', disclosureController.sendNotification);
    // app.post('/foo', disclosureController.updateFoo);
};