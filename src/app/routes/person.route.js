const personController = require('../controllers/person.controller');
const uploadCSV = require('../../utilities/upload-csv.utils');
module.exports = app => {
    app.post('/person', personController.createPerson);
    app.get('/persons', personController.getAllPersons);
    app.get('/person/:mobile', personController.getSinglePerson);
    app.post('/person/csv', uploadCSV, personController.csvFile);
    app.patch('/person/:mobile', personController.blockPerson);
    app.patch('/person/role/:mobile', personController.personRole);
    app.put('/person/:mobile', personController.editPerson);
    app.delete('/person/:mobile', personController.deletePerson);
    app.post('/person/email', personController.sendEmail);
    app.post('/person/delete', personController.deleteMultiple);
    app.get('/person/role/:mobile', personController.getRole);
};