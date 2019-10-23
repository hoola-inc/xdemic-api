const csv = require('csvtojson');

readCSV = async () => {
    const jsonArray = await csv().fromFile(require('path').join(__dirname, '../../public/files/csv/annual-enterprise-survey-2018-financial-year-provisional-csv.csv'));
    console.log(jsonArray);
}

readCSV();