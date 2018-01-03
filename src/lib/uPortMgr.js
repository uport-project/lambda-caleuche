//import { JWT } from 'uport'
import UportLite from 'uport-lite'
import { verifyJWT } from 'uport/lib/JWT'

class UportMgr {

    constructor (settings = {}) {
        this.settings = settings
        const registry =  new UportLite()

        this.settings.registry = (address) => new Promise((resolve, reject) => {
            registry(address, (error, profile) => {
                if (error) return reject(error)
                resolve(profile)
            })
        })
    }


    async verifyToken(token){
        if(!token) throw('no token')
        return verifyJWT(this.settings,token)
    }


}
module.exports = UportMgr;
