'use strict'

const Schema = use('Schema')

class RoleUserTableSchema extends Schema {
    up() {
        this.create('sso_accesses', table => {
            table.uuid('id').primary().unique()
            table.string('domain').notNullable().unique()
            table.string('secret').notNullable()
            table.timestamps()
        })
    }

    down() {
        this.drop('sso_accesses')
    }
}

module.exports = RoleUserTableSchema
