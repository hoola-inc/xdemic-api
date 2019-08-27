module.exports = app => {
    const disclosureController = require('../controllers/disclosure-request.controller');
    const uuid = require('node-uuid');
    const randomID = uuid.v4();
    app.get('/qrcode', disclosureController.showQRCode);
    app.post('/callback', disclosureController.varifyClaims);
};