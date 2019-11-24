module.exports = app => {
    const personController = require('../controllers/person.controller');
    const uploadImage = require('../../utilities/multer.utilituy');

    app.post('/person', personController.createPerson);
    app.get('/persons', personController.getAllPersons);
    app.post('/person/csv', uploadImage, personController.csvFile);
};