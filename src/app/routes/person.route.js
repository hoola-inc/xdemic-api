module.exports = app => {
    const personController = require('../controllers/person.controller');
    const uploadCSV = require('../../utilities/upload-csv.utils');

    app.post('/person', personController.createPerson);
    app.get('/persons', personController.getAllPersons);
    app.get('/person/:mobile', personController.getSinglePerson);
    app.post('/person/csv', uploadCSV, personController.csvFile);
    app.patch('/person/:mobile', personController.blockPerson);
    app.put('/person/:mobile', personController.editPerson);
    app.delete('/person/:mobile', personController.deletePerson);
    app.post('/person/sendemail', personController.sendEmail);
};