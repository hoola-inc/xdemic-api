const ipfsClient = require('ipfs-http-client');
ipfsClient({ timeout: '2m' });
const ipfs = ipfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
});

module.exports = {
    ipfs: ipfs
}