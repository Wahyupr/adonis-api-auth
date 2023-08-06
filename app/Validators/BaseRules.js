"use strict";

// base of all rules
class BaseRules {
  async fails(errorMessages) {
    return this.ctx.response.badRequest({
      message: errorMessages[0].message
    });
  }
}

module.exports = BaseRules;
