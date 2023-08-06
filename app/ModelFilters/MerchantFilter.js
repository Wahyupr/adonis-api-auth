'use strict'

const ModelFilter = use('ModelFilter')

class MerchantFilter extends ModelFilter {
  code(code) {
    return this.where('code', 'ilike', `%${code}%`)
  }

  brandName(brandName) {
    return this.where('brand_name', 'ilike', `%${brandName}%`)
  }

  fullName(fullName) {
    return this.where('full_name', 'ilike', `%${fullName}%`)
  }

  email(email) {
    return this.where('email', 'ilike', `%${email}%`)
  }

  phone(phone) {
    return this.where('phone', 'ilike', `%${phone}%`)
  }

  url(url) {
    return this.where('url', 'ilike', `%${url}%`)
  }
}

module.exports = MerchantFilter
