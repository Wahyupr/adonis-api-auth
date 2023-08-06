'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SessionSchema extends Schema {
  up() {
    this.create('sessions', (table) => {
      table.uuid('id').primary().unique()
      table.uuid('user_id')
      table.timestamp('login_datetime', { useTz: false })
      table.timestamp('logout_datetime', { useTz: false })
      table.integer('auth_token_iat')
      table.integer('auth_token_exp')
      table.timestamps()
    })
  }

  down() {
    this.drop('sessions')
  }
}

module.exports = SessionSchema
