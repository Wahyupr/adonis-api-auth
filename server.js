'use strict'



// const apm = require('elastic-apm-node').start({
//   // Override service name from package.json
//   // Allowed characters: a-z, A-Z, 0-9, -, _, and space
//   serviceName: process.env.ELASTIC_APM_SERVICE_NAME,

//   // Use if APM Server requires a token
//   secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,

//   // Use if APM Server uses API keys for authentication
//   apiKey: process.env.ELASTIC_APM_API_KEY,

//   // Set custom APM Server URL (default: http://localhost:8200)
//   serverUrl: process.env.ELASTIC_APM_SERVER_URL,
// })
/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstraps Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass a relative path from the project root.
*/

const { Ignitor } = require('@adonisjs/ignitor')

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .catch(console.error)
