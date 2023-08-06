"use strict"

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
// eslint-disable-next-line no-undef
const Route = use("Route")

Route.get("/", () => {
  return {
    message: "AdonisJS Back End"
  }
})

// Auth Route
Route.group(() => {
  Route.post('/register', 'AuthController.register').validator('AuthRules/RegisterRules')
  Route.post('/login', 'AuthController.login')
  Route.post('/validatesession', 'AuthController.sessionCheck').middleware(['session'])
  // Route.post('/access', 'AuthController.apiAuthorize')
  Route.post('/refresh-token', 'AuthController.refreshToken').validator('AuthRules/RefreshToken').middleware(['auth'])
  Route.get('/me', 'AuthController.getUser').middleware(['auth'])
  Route.get('/logout', 'AuthController.logout').middleware(['auth'])
}).prefix("/api/v1/auth")

// SSO
Route.group(() => {
  Route.get('/exchange-token', 'SsoController.exchangeToken').validator('Sso/SsoExchangeTokenRules')
  Route.get('/validate-token', 'SsoController.validateToken').middleware(['auth'])
  Route.get('/authorize', 'SsoController.authorize').middleware(['auth'])
}).prefix("/api/v1/sso")

