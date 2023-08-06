'use strict'

const ModelFilter = use('ModelFilter')

class MerchantDeviceRequestFilter extends ModelFilter {
  name(name) {
    return this.where('name', 'ILIKE', `%${name}%`)
  }
}

module.exports = MerchantDeviceRequestFilter
