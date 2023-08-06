'use strict'

const Cache = use('Cache')
const { v4: uuid } = require('uuid')
const SsoAccess = use('App/Models/SsoAccess')
const User = use('App/Models/User')
const CustomException = use('App/Exceptions/CustomException')

const ssoKey = 'sso-code'

class SsoService {
    async validateAccess({ user_login, code, domain, secret }) {
        let ssoAccess = await SsoAccess
            .query()
            .where('domain', domain)
            .where('secret', secret)
            .fetch()

        let ssoCode = await Cache.get(ssoKey)
        await Cache.forget(ssoKey)

        let user = await User.findBy('email', user_login)
        if (user === null) {
            throw new CustomException("User not found", "FAILED", "SVD_USER_NOTFOUND")
        }

        if (ssoAccess.rows.length > 0) {
            return { user }
        } else {
            throw new CustomException("Access denied", "FAILED", "SVD_ACCESS_SSO")
        }
    }

    async generateCode() {
        Cache.put('sso-code', uuid(), 5)
        return await Cache.get(ssoKey)
    }
}

module.exports = SsoService
