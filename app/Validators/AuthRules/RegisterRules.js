'use strict'
const BaseRules = use("./../BaseRules")

class RegisterRules extends BaseRules {
    get rules() {
        return {
            username: "required|unique:users,username",
            email: "required|email|unique:users,email",
            password: "required",
        }
    }

    get messages() {
        return {
            "username.required": "You must provide a username.",
            "username.unique": "This username is already registered.",
            "email.required": "You must provide a email address.",
            "email.email": "You must provide a valid email address.",
            "email.unique": "This email is already registered.",
            "password.required": "You must provide a password"
        }
    }
}

module.exports = RegisterRules
