const schoolController = require('../controllers/school.controller');
const uploadImage = require('../../utilities/multer.utilituy');
module.exports = app => {
    app.post('/school', uploadImage, schoolController.createSchool);
    app.get('/schools', schoolController.getSchool);
    app.get('/schoolwithjwt', schoolController.getSchoolWithSignedJWT); // TODO change here ...
    app.get('/schoolwithstudentenroll/:did', schoolController.getSchoolWithStudent);
};