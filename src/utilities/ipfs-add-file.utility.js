const fs = require('fs');
const ipfs = require('../config/ipfs.config').ipfs;
const ipfsModel = require('../app/models/ipfs-hash.model');

exports.addFileIPFS = async (fileName, filePath) => {
    try {
        console.log(fileName, filePath);
        console.log('IPFs ... ');
        const fileBuffer = fs.readFileSync(filePath);
        console.log('file buffer: ', fileBuffer);
        const fileAdded = await ipfs.add({
            path: filePath,
            content: fileBuffer
        });
        console.log('file added : ', fileAdded);
        const fileHash = fileAdded[0].hash;
        console.log(fileHash);
        if (fileHash) {
            const createIPFSFileHash = new ipfsModel({
                did: fileName,
                ipfsHash: fileHash
            });
            console.log('saving ipfs hash...')
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