'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { v4: uuid } = require('uuid')

class RoleUser extends Model {
  static get table() {
    return 'role_user'
  }

  static boot() {
    super.boot()

    this.addHook('beforeCreate', async (modelInstance) => {
      modelInstance.id = uuid()
    })

  }
}

module.exports = RoleUser
