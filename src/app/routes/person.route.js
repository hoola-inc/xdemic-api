module.exports = app => {
    const personController = require('../controllers/person.controller');
    const uploadCSV = require('../../utilities/upload-csv.utils');

    app.post('/person', personController.createPerson);
    app.get('/persons', personController.getAllPersons);
    app.post('/person/csv', uploadCSV, personController.csvFile);
    app.put('/person/:did', personController.blockPerson);
};