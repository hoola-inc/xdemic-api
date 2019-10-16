const fs = require('fs');
const ipfs = require('../config/ipfs.config').ipfs;

exports.addFileIPFS = async (fileName, filePath) => {
    try {
        // console.log(fileName, filePath);
        const file = fs.readFileSync(filePath);
        const fileAdded = await ipfs.add({
            path: fileName,
            content: file
        });
        const fileHash = fileAdded[0].hash;
        // console.log(fileHash);
        return fileHash;
    } catch (error) {
        // console.log(error);
        throw new Error(error);
    }
};