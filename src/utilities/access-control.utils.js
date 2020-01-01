let acl = require('acl');
const dotEnv = require('dotenv');
dotEnv.config();

const dbInstance = require('../config/db.config');

acl = new acl(new acl.mongodbBackend(process.env.DB_URL, 'Mongodb'));

acl.allow('admin', '/schools');