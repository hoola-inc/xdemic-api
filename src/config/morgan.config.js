const fs = require('fs')
const morgan = require('morgan')
const path = require('path')

module.exports = (app) => {
    // log only 4xx and 5xx responses to console
    app.use(morgan('combined', {
        skip: function (req, res) { return res.statusCode < 400 }
    }));

    // log all requests to access.log
    app.use(morgan('common', {
        stream: fs.createWriteStream(path.join(__dirname, '../../logs/access.log'), { flags: 'a' })
    }));
};
