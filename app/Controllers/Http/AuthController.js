'use strict'
const Env = use('Env')
const Hash = use('Hash')
const CE = use('App/Exceptions/CustomException')
const AuthService = use('App/Services/AuthService')


// Global Var
var failedLoginAttempt = {}
var failedLoginTimeout = {}
var allowedToLogin = {}

class AuthController {
  constructor() {
    this.authService = new AuthService()
  }
  async register({ request, response }) {
    try {
      await this.authService.register(request.only(['username', 'email', 'password']))
      return CE.getResponse({
        message_code: 'REGISTER_SUCCESS',
        response: response,
      })
    } catch (error) {
      return CE.getErrorResponse(error, response)
    }
  }

  async login({ request, auth, response }) {
    try {
      let param = request.all()

      let userEmail = param.email
      let userIP = request.ip()
      let loginAttemptTimeout = Env.get('LOGIN_ATTEMPT_TIMEOUT', 60)
      let loginAttemptTry = Env.get('LOGIN_ATTEMPT_TRY', 5)
      let JWTExpirationDuration = Env.get('JWT_EXPIRATION_DURATION', '86400s')
      loginAttemptTimeout *= 1000

      if (allowedToLogin[userEmail + userIP] !== false) {
        let jwtOptions = {
          algorithm: 'RS256',
          expiresIn: JWTExpirationDuration
        }

        if (param.remember_me === true) {
          jwtOptions.expiresIn = '2592000s'
        }

        // get user data from login params
        let user = await this.authService.login(param)

        if (user === null) {
          // Failed login
          failedLoginAttempt[userEmail + userIP] = typeof (failedLoginAttempt[userEmail + userIP]) === 'undefined' ? 1 : failedLoginAttempt[userEmail + userIP] + 1
          //block if >= 5x failed attemp
          if (failedLoginAttempt[userEmail + userIP] >= loginAttemptTry) {
            console.log("User " + userEmail + " with ip " + userIP + " has been blocked temporarily for too many failed login attempts.")
            allowedToLogin[userEmail + userIP] = false
          }
          if (typeof (failedLoginTimeout[userEmail + userIP]) != 'undefined') {
            clearTimeout(failedLoginTimeout[userEmail + userIP])
            failedLoginTimeout[userEmail + userIP] = null
            delete failedLoginTimeout[userEmail + userIP]
          }
          failedLoginTimeout[userEmail + userIP] = await this.houseKeepingLoginAttemp(userEmail, userIP, loginAttemptTimeout)

          // Wait for 0.5 sec to avoid brute force
          await this.sleep(500)
          throw new CE(CE.getMessage('LOGIN_FAILED'), '', 'LOGIN_FAILED')
        }

        let { roles, role_details } = await this.authService.getUser(user)

        if (await Hash.verify(param.password, user.password)) {
          // generator for user
          let accessToken = null

          accessToken = await auth.withRefreshToken().generate(user, {
            id: user.id,
            username: user.username,
            roles: roles,
            group: role_details.toJSON()[0].group,
            remember: param.remember_me
          }, jwtOptions)

          // dont show password to response
          user.password = null

          //create session
          await this.authService.createSession(accessToken.token)

          await this.houseKeepingLoginAttemp(userEmail, userIP, 0)

          return CE.getResponse({
            message_code: 'SUCCESS',
            response: response,
            data: {
              user: user,
              roles: roles,
              access_token: accessToken
            }
          })
        } else {
          // Failed login
          failedLoginAttempt[userEmail + userIP] = typeof (failedLoginAttempt[userEmail + userIP]) === 'undefined' ? 1 : failedLoginAttempt[userEmail + userIP] + 1
          //block if >= 5x failed attemp
          if (failedLoginAttempt[userEmail + userIP] >= loginAttemptTry) {
            console.log("User " + userEmail + " with ip " + userIP + " has been blocked temporarily for too many failed login attempts.")
            allowedToLogin[userEmail + userIP] = false
          }
          if (typeof (failedLoginTimeout[userEmail + userIP]) != 'undefined') {
            clearTimeout(failedLoginTimeout[userEmail + userIP])
            failedLoginTimeout[userEmail + userIP] = null
            delete failedLoginTimeout[userEmail + userIP]
          }
          failedLoginTimeout[userEmail + userIP] = await this.houseKeepingLoginAttemp(userEmail, userIP, loginAttemptTimeout)

          // Wait for 0.5 sec to avoid brute force
          await this.sleep(500)

          throw new CE(CE.getMessage("LOGIN_FAILED"), '', 'LOGIN_FAILED')
        }
      } else {
        // Wait for 0.5 sec to avoid brute force
        await this.sleep(500)
        throw new CE(CE.getMessage("LOGIN_ATTEMPT_FAILED"), '', 'LOGIN_ATTEMPT_FAILED')
      }
    } catch (error) {
      return CE.getErrorResponse(error, response)
    }
  }

  async getUser({ response, user }) {
    try {
      const { id } = user
      const users = await this.authService.getUser({ id })

      return CE.getResponse({
        message_code: 'SUCCESS',
        response: response,
        data: users
      })
    } catch (error) {
      return CE.getErrorResponse(error, response)
    }
  }

  async houseKeepingLoginAttemp(user, ip, interval) {
    return setTimeout(() => {
      console.log("Clearing login attempts for user " + user + " with ip " + ip)
      failedLoginAttempt[user + ip] = null
      delete failedLoginAttempt[user + ip]
      allowedToLogin[user + ip] = null
    }, interval)
  }

  sleep(interval) {
    return new Promise((resolve) => {
      setTimeout(resolve, interval);
    });
  }

  async sessionCheck({ token, response }) {
    try {
      let session = await this.authService.sessionCheck(token)
      return CE.getResponse({
        message_code: 'VALID_SESSION',
        response: response,
        data: session
      })
    } catch (e) {
      return CE.getErrorResponse(e, response)
    }
  }

  // async apiAuthorize({ request, auth, response }) {
  //   try {
  //     let param = request.all()
  //     // get user data from login params
  //     let { user, merchant } = await this.authService.merchantAccess(param)
  //     if (user === null) {
  //       throw new CE(CE.getMessage("LOGIN_FAILED"), '', 'LOGIN_FAILED')
  //     }

  //     // generator for user
  //     let accessToken = null
  //     if (merchant !== null)
  //       accessToken = await auth.withRefreshToken().generate(user, {
  //         aino_merchant_id: merchant.code,
  //         merchant_id: merchant.id,
  //         merchant_name: merchant.full_name,
  //         email: user.email
  //       })
  //     else
  //       accessToken = await auth.withRefreshToken().generate(user)

  //     return CE.getResponse({
  //       message_code: 'SUCCESS',
  //       response: response,
  //       data: {
  //         user: user,
  //         merchant: merchant,
  //         access_token: accessToken
  //       }
  //     })
  //   } catch (error) {
  //     return CE.getErrorResponse(error, response)
  //   }
  // }
  async refreshToken({ request, user, auth, response }) {
    let refreshToken = request.input("refresh_token")

    try {
      let accessToken = await auth.newRefreshToken().generateForRefreshToken(refreshToken, user)

      return CE.getResponse({
        message_code: 'SUCCESS',
        response: response,
        data: {
          access_token: accessToken
        }
      })
    } catch (error) {
      return CE.getErrorResponse(error, response)
    }
  }

  async logout({ auth, response }) {
    try {
      const apiToken = auth.getAuthHeader()
      await auth.authenticator("jwt").revokeTokens([apiToken])
      await this.authService.closeSession(apiToken)

      return CE.getResponse({
        message_code: 'SUCCESS',
        response: response,
        data: null
      })
    } catch (e) {
      return CE.getErrorResponse(error, response)
    }
  }

}

module.exports = AuthController
