'use strict'

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Swagger Information
  | Please use Swagger 2 Spesification Docs
  | https://swagger.io/docs/specification/2-0/basic-structure/
  |--------------------------------------------------------------------------
  */

  enable: true,
  specUrl: '/swagger.json',

  options: {
    swaggerDefinition: {
      info: {
        title: 'SVD API Provisioning Collection',
        version: '1.0.0',
      },
  
      basePath: '/',

      // Example security definitions.
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          description: "Please add 'Bearer ' in front of your token value",
          in: 'header'
        },
      },
      definitions: {
        EmailPassword: {
          type: "object",
          properties: {
            email: {
              type: "string"
            },
            password: {
              type: "string"
            }
          }
        }
      }
    },

    // Path to the API docs
    // Sample usage
    // apis: [
    //    'docs/**/*.yml',    // load recursive all .yml file in docs directory
    //    'docs/**/*.js',     // load recursive all .js file in docs directory
    // ]
    apis: [
      'docs/**/*.yml',    // load recursive all .yml file in docs directory
      'docs/**/*.js',     // load recursive all .js file in docs directory
      'app/**/*.js',
      'start/routes.js'
    ]
  }
}