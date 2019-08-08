module.exports = app => {
    const disclosureController = require('../controllers/disclosure-request.controller');

    app.get('/qrcode', disclosureController.showQRCode);
    app.post('/qrcode/callback', disclosureController.varifyClaims);
};