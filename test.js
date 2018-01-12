const multihash = require('multi-hash')
const SHA256 = require('crypto-js/sha256')

function getId(eventData){
    //Calc hash of eventData (IPFS style please)
    let hash=SHA256(JSON.stringify(eventData))
    let ipfsHash=multihash.encode(hash.toString());
    return ipfsHash;
}

console.log(getId("Cristobal Castillo"))
