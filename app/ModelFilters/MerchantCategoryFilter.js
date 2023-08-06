'use strict'

const ModelFilter = use('ModelFilter')

class MerchantCategoryFilter extends ModelFilter {
  name(name) {
    return this.where('name', 'ILIKE', `%${name}%`)
  }
}

module.exports = MerchantCategoryFilter
