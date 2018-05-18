require('ethr-did-resolver')()
require('uport-did-resolver')()
require('muport-did-resolver')()
import { verifyJWT } from "did-jwt/lib/JWT";

class UportMgr {

  async verifyToken(token) {
    if (!token) throw "no token";
    return verifyJWT(token);
  }
}
module.exports = UportMgr;
