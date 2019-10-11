const fs = require('fs');
// const ipfs = require('../config/ipfs.config').ipfs;
const ipfsClient = require('ipfs-http-client');


const ipfs = new ipfsClient({
    host: 'localhost',
    port: 5001,
    protocol: 'http'
});


exports.addFileIPFS = async (fileName, filePath) => {
    try {
        const file = fs.readFileSync(filePath);
        const fileAdded = await ipfs.add({
            path: fileName,
            content: file
        });
        console.log('file added working ...');
        console.log(fileAdded);
        // const fileHash = fileAdded[0].hash;
        // console.log(fileHash);
        // return fileHash;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};