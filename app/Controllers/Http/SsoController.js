'use strict'

const SsoService = use('App/Services/SsoService')
const AuthService = use('App/Services/AuthService')
const CE = use('App/Exceptions/CustomException')

class SsoController {
    constructor() {
        this.ssoService = new SsoService()
        this.authService = new AuthService()
    }

    async exchangeToken({ request, auth, response }) {
        try {
            let { user } = await this.ssoService.validateAccess(request.all())
            let { roles, role_details } = await this.authService.getUser(user)
            let accessToken = null
            accessToken = await auth.generate(user, {
                id: user.id,
                username: user.username,
                roles: roles,
            })

            user.password = null

            return CE.getResponse({
                message_code: 'SUCCESS',
                response: response,
                data: {
                    user: user,
                    roles: roles,
                    role_details: role_details,
                    access_token: accessToken,
                }
            })
        } catch (error) {
            return CE.getErrorResponse(error, response)
        }
    }

    async validateToken({ response }) {
        try {
            return CE.getResponse({
                message_code: 'SUCCESS',
                response: response,
                data: null
            })
        } catch (error) {
            return CE.getErrorResponse(error, response)
        }
    }

    async authorize({ response, session }) {
        try {
            let code = await this.ssoService.generateCode()
            return CE.getResponse({
                message_code: 'SUCCESS',
                response: response,
                data: {
                    code: code
                }
            })
        } catch (error) {
            return CE.getErrorResponse(error, response)
        }
    }
}

module.exports = SsoController
