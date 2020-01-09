const csv = require('csvtojson');

exports.readCSV = async (filename) => {
    try {
        const jsonArray = await csv().fromFile(require('path').join(__dirname, `../../public/csv-files/${filename}`));
        return jsonArray;
    } catch (error) {
        throw Error(error);
    }
}
