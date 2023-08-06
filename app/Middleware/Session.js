'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const fs = require('fs')
const jwt = require('jsonwebtoken');
const CustomException = use('App/Exceptions/CustomException')
const User = use("App/Models/User");

class Session {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle(ctx, next) {
    try {
      ctx.token = ctx.auth.getAuthHeader()
      await next()
    } catch (error) {
      return ctx.response.status(401).json({
        code: 401,
        message: error.message
      })
    }
  }
}

module.exports = Session
