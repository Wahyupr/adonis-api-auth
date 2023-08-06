'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Hash = use('Hash')
const { v4: uuid } = require('uuid')

class User extends Model {
  static boot() {
    super.boot()

    this.addHook('beforeCreate', async (modelInstance) => {
      modelInstance.id = uuid()
    })

    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  roles() {
    return this.belongsToMany(
      'App/Models/Role',
      'user_id',
      'role_id',
      'id',
      'id',
    )
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  static get traits() {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ]
  }

  roles() {
    return this.belongsToMany('App/Models/Role').pivotTable('role_user').withTimestamps()
  }
}

module.exports = User
