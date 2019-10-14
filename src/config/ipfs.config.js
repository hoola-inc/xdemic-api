const ipfsClient = require('ipfs-http-client');

const ipfs = new ipfsClient({
    host: 'localhost',
    port: 5001,
    protocol: 'http'
});


module.exports = {
    ipfs: ipfs
}