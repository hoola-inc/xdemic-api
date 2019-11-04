module.exports = app => {
    const personController = require('../controllers/person.controller');

    app.post('/person', personController.createPerson);
};