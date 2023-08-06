'use strict'

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Role = use('App/Models/Role')
class RoleSeeder {
  async run() {
    const rolesData = [
      {
        slug: 'root',
        name: 'Root',
        description:
          'Super user for developers, you can do anything with this user role :)'
      },
      {
        slug: 'administrator',
        name: 'Administrator',
        description: 'High Level role that can do CRUD All'
      },
      {
        slug: 'editor',
        name: 'Editor',
        description: 'Middle Level role that can do CRU all'
      },
      {
        slug: 'author',
        name: 'Author',
        description: 'Middle Level role that can do CR all'
      },
      {
        slug: 'contributor',
        name: 'Contributor',
        description: 'Low Level role that can do R all'
      },
      {
        slug: 'guest',
        name: 'Guest',
        description: 'Guest Level role that can do R something'
      },
    ]

    for (let role of rolesData) {
      const result = await Role.findOrCreate(role)
      console.log(`insert role ${result.name} success!`)
    }
  }
}

module.exports = RoleSeeder
