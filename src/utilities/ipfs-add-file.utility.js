const fs = require('fs');
const ipfs = require('../config/ipfs.config').ipfs;
const ipfsModel = require('../app/models/ipfs-hash.model');

exports.addFileIPFS = async (fileName, filePath) => {
    try {
        // console.log(fileName, filePath);
        const file = fs.readFileSync(filePath);
        const fileAdded = await ipfs.add({
            path: fileName,
            content: file
        });
        const fileHash = fileAdded[0].hash;
        console.log(fileHash);
        if (fileHash) {
            const createIPFSFileHash = new ipfsModel({
                did: fileName,
                ipfsHash: fileHash
            });
            const saveFileHash = await createIPFSFileHash.save();
            if (saveFileHash) {
                return fileHash;
            }
        } else {
            throw new Error('IPFS Hash not found');
        }
        // console.log(fileHash);
        // return fileHash;
    } catch (error) {
        // console.log(error);
        throw new Error(error);
    }
};