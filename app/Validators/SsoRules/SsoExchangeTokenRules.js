'use strict'

const BaseRules = use("./../BaseRules")

class SsoExchangeTokenRules extends BaseRules {
    get rules() {
        return {
            user_login: 'required|email',
            code: 'required',
            domain: 'required',
            secret: 'required'
        }
    }
}

module.exports = SsoExchangeTokenRules