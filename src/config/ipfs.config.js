const ipfsClient = require('ipfs-http-client');

const ipfs = new ipfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
});


module.exports = {
    ipfs: ipfs
}