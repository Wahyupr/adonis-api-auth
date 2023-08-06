'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { v4: uuid } = require('uuid')
class SsoAccess extends Model {
    static boot() {
        super.boot()

        this.addHook('beforeCreate', async (modelInstance) => {
            modelInstance.id = uuid()
        })

    }
}

module.exports = SsoAccess
