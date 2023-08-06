"use strict";

const BaseRules = use("./../BaseRules");

class RefreshToken extends BaseRules {
  get rules() {
    return {
      refresh_token: "required"
    };
  }

  get messages() {
    return {
      "refresh_token.required": "You must provide a refresh_token."
    };
  }
}

module.exports = RefreshToken;
