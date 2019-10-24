const fs = require('fs');
const mongo = require('mongodb');
const Grid = require('gridfs');

mongo.MongoClient.connect(process.env.DB_URL, (err, db) => {
    if(err) {
        console.log(err.message);
    }
    console.log('Database ::: ', db);
    const gfs = Grid(db, mongo);
    const source = '../../public/files/csv/annual-enterprise-survey-2018-financial-year-provisional-csv.csv';
    gfs.fromFile({
        filename: 'annual-enterprise-survey-2018-financial-year-provisional-csv'
    },
        source,
        (err, file) => {
            console.log('saved %s to GridFS file %s', source, file._id);
            gfs.readFile({ _id: file._id }, function (err, data) {
                console.log('read file %s: %s', file._id, data.toString());
            });
        });
});