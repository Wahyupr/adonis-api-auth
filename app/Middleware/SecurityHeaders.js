'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class SecurityHeaders {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
    async handle(ctx, next) {
        try {
            ctx.response.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
            await next()
        } catch (error) {
            return ctx.response.status(401).json({
                code: 401,
                message: error.message
            })
        }
    }
}

module.exports = SecurityHeaders
