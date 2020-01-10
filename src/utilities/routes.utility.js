// file system
const normalize_path = require('path').join(__dirname, '../app/routes');
const path = '../app/routes/';

module.exports = (app) => {
  require('fs')
    .readdirSync(normalize_path)
    .forEach(file => {
      // uncomment this for testing
      // console.log(file," route loaded");
      require(path + file)(app);
    });
};
