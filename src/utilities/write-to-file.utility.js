const fs = require('fs');

exports.writeToFile = (did, dirName, data) => {
    return new Promise((resolve, reject) => {
        const path = require('path').join(__dirname, `../../http-files/${dirName}/${did}.json`);
        console.log(path);
        fs.writeFile(path, data, (err) => {
            if (err) {
                console.log(err);
                reject('an error occured while creating file');
            } else {
                resolve(true);
            }
        });
    })
}