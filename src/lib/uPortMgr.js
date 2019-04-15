const didJWT = require("did-jwt")
require('ethr-did-resolver').default();
require('uport-did-resolver').default();

require('nacl-did').registerNaclDID();

class UportMgr {

  async verifyToken(token) {
    if (!token) throw "no token";
    return didJWT.verifyJWT(token);
  }
}
module.exports = UportMgr;
