"use strict"

/** @type {import('@adonisjs/framework/src/Hash')} */

const fs = require('fs')
const jwt = require('jsonwebtoken');
const RespErrors = use('App/Wrappers/RespError')
const CE = use('App/Exceptions/CustomException');
const Database = use('Database');
const UserMDL = use("App/Models/User");
const RoleUserMDL = use("App/Models/RoleUser");
const SessionMDL = use('App/Models/Session')
const moment = use('moment')
class AuthService {
  constructor() {
    this.jwtSecret = fs.readFileSync('./cert/jwtRS256.key.pub')
  }

  async register(params) {
    // get role
    const trx = await Database.beginTransaction()
    const getRole = await Database.from('roles').where('slug', 'guest').limit(1);
    if (getRole[0].id == undefined) {
      throw new RespErrors('Error while get role data', `Error while get role data`)
    }

    const idRole = getRole[0].id
    const dataUser = {
      username: params.username,
      email: params.email,
      password: params.password,
      is_active: true
    }

    try {
      const createdUser = await UserMDL.create(dataUser, trx);
      const dataRolesUser = {
        user_id: createdUser.id,
        role_id: idRole
      }
      await RoleUserMDL.create(dataRolesUser, trx)
      await trx.commit()
      return

    } catch (e) {
      await trx.rollback()
      // return error
      throw new RespErrors('E_FAILED_INSERT', e.message)
    }
  }

  async login(params) {
    // return params
    const user = await UserMDL.findBy("email", params.email)
    if (user == null) {
      return { user: null, merchant: null }
    }
    if (!user.is_active) {
      throw new CE(CE.getMessage('USER_IS_INACTIVE'), '', 'USER_IS_INACTIVE')
    }

    return user
  }

  async getUser({ id }) {
    const user = await UserMDL.find(id)
    const roles = await user.getRoles()
    const role_details = await user.roles().setVisible(['slug', 'name']).fetch()
    return { user, roles, role_details }
  }

  async createSession(authtoken) {
    try {
      let payload = jwt.verify(authtoken, this.jwtSecret)
      //logout from previous session if not logged out
      await SessionMDL.query().where('user_id', payload.data.id).update({ logout_datetime: new Date() })

      //create new session
      await SessionMDL.create({
        user_id: payload.data.id,
        login_datetime: new Date(),
        auth_token_iat: payload.iat,
        auth_token_exp: payload.exp,
      })
    } catch (e) {
      throw new RespErrors('Failed to create session', e.message)
    }
  }

  async sessionCheck(authtoken) {
    let payload = jwt.verify(authtoken, this.jwtSecret)
    //check whether token is expired
    if (payload.exp <= moment().unix()) {
      throw new CE(CE.getMessage('E_INVALID_SESSION'), '', 'E_INVALID_SESSION')
    }

    //check whether session is valid
    let rslt = await Database.raw("select * from sessions where user_id = ? order by created_at desc limit 1;", payload.data.id)
    if (rslt.rows.length != 1) {
      throw new CE(CE.getMessage('E_INVALID_SESSION'), '', 'E_INVALID_SESSION')
    } else {
      if (rslt.rows[0].logout_datetime != null) {
        throw new CE(CE.getMessage('E_INVALID_SESSION'), '', 'E_INVALID_SESSION')
      } else {
        //session is valid
        return rslt.rows[0]
      }
    }
  }

  async closeSession(authtoken) {
    try {
      let payload = jwt.verify(authtoken, this.jwtSecret)
      await Database.raw("update sessions set logout_datetime = now() where user_id = ? and logout_datetime is null;", [payload.data.id])
    } catch (e) {
      throw new CE(CE.getMessage('E_CLOSE_SESSION'), '', 'E_CLOSE_SESSION')
    }
  }

}

module.exports = AuthService
