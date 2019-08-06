module.exports = app => {
    const disclosureController = require('../controllers/disclosure-request.controller');

    app.get('/disclosure.html', disclosureController.showQRCode);
};