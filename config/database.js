'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

/** @type {import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers')

module.exports = {
    /*
    |--------------------------------------------------------------------------
    | Default Connection
    |--------------------------------------------------------------------------
    |
    | Connection defines the default connection settings to be used while
    | interacting with SQL databases.
    |
    */
    connection: Env.get('DB_CONNECTION', 'sqlite'),

    /*
    |--------------------------------------------------------------------------
    | Sqlite
    |--------------------------------------------------------------------------
    |
    | Sqlite is a flat file database and can be a good choice for a development
    | environment.
    |
    | npm i --save sqlite3
    |
    */
    sqlite: {
        client: 'sqlite3',
        connection: {
            filename: Helpers.databasePath(`${Env.get('DB_DATABASE', 'development')}.sqlite`)
        },
        useNullAsDefault: true,
        debug: Env.get('DB_DEBUG', true)
    },

    /*
    |--------------------------------------------------------------------------
    | MySQL
    |--------------------------------------------------------------------------
    |
    | Here we define connection settings for MySQL database.
    |
    | npm i --save mysql
    |
    */
    mysql: {
        client: 'mysql',
        connection: {
            host: Env.get('DB_HOST', 'localhost'),
            port: Env.get('DB_PORT', ''),
            user: Env.get('DB_USER', 'root'),
            password: Env.get('DB_PASSWORD', ''),
            database: Env.get('DB_DATABASE', 'adonis')
        },
        debug: Env.get('DB_DEBUG', true)
    },

    /*
    |--------------------------------------------------------------------------
    | PostgreSQL
    |--------------------------------------------------------------------------
    |
    | Here we define connection settings for PostgreSQL database.
    |
    | npm i --save pg
    |
    */
    pg: {
        client: 'pg',
        connection: {
            // application_name: Env.get('DB_APPLICATION_NAME', 'svd-api'),
            host: Env.get('DB_HOST', 'localhost'),
            port: Env.get('DB_PORT', ''),
            user: Env.get('DB_USER', 'root'),
            password: Env.get('DB_PASSWORD', ''),
            database: Env.get('DB_DATABASE', 'adonis'),
        },
        // pool: {
        //     min: parseInt(Env.get('DB_MASTER_MIN_CONNECTION', 1)),
        //     max: parseInt(Env.get('DB_MASTER_MAX_CONNECTION', 100)),
        //     propagateCreateError: false
        // },
        debug: Env.get('DB_DEBUG', true)
    },
    // pg_chipbase_trxn: {
    //     client: 'pg',
    //     connection: {
    //         application_name: Env.get('DB_APPLICATION_NAME', 'svd-api'),
    //         host: Env.get('DB_CHIPBASE_HOST', 'localhost'),
    //         port: Env.get('DB_CHIPBASE_PORT', '5432'),
    //         user: Env.get('DB_CHIPBASE_USER', 'root'),
    //         password: Env.get('DB_CHIPBASE_PASSWORD', ''),
    //         database: Env.get('DB_CHIPBASE_DATABASE', 'adonis'),
    //         multipleStatements: true
    //     },
    //     pool: {
    //         min: parseInt(Env.get('DB_MASTER_MIN_CONNECTION', 1)),
    //         max: parseInt(Env.get('DB_MASTER_MAX_CONNECTION', 100)),
    //         propagateCreateError: false
    //     },
    //     debug: Env.get('DB_DEBUG', true)
    // },
    // pg_serverbase_trxn: {
    //     client: 'pg',
    //     connection: {
    //         application_name: Env.get('DB_APPLICATION_NAME', 'svd-api'),
    //         host: Env.get('DB_SERVERBASE_HOST', 'localhost'),
    //         port: Env.get('DB_SERVERBASE_PORT', '5432'),
    //         user: Env.get('DB_SERVERBASE_USER', 'noval'),
    //         password: Env.get('DB_SERVERBASE_PASSWORD', 'noval'),
    //         database: Env.get('DB_SERVERBASE_DATABASE', 'adonis'),
    //         multipleStatements: true
    //     },
    //     pool: {
    //         min: parseInt(Env.get('DB_MASTER_MIN_CONNECTION', 1)),
    //         max: parseInt(Env.get('DB_MASTER_MAX_CONNECTION', 100)),
    //         propagateCreateError: false
    //     },
    //     debug: Env.get('DB_DEBUG', true)
    // },
    // pg_transaction_data: {
    //     client: 'pg',
    //     connection: {
    //         application_name: Env.get('DB_APPLICATION_NAME', 'svd-api'),
    //         host: Env.get('DB_TRANSACTION_HOST', 'localhost'),
    //         port: Env.get('DB_TRANSACTION_PORT', '5432'),
    //         user: Env.get('DB_TRANSACTION_USER', 'root'),
    //         password: Env.get('DB_TRANSACTION_PASSWORD', ''),
    //         database: Env.get('DB_TRANSACTION_DATABASE', 'adonis'),
    //         multipleStatements: true
    //     },
    //     pool: {
    //         min: parseInt(Env.get('DB_MASTER_MIN_CONNECTION', 1)),
    //         max: parseInt(Env.get('DB_MASTER_MAX_CONNECTION', 100)),
    //         propagateCreateError: false
    //     },
    //     debug: Env.get('DB_DEBUG', true)
    // }
}
