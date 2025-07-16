require('@dotenvx/dotenvx').config()
//internal configuration for db and NodeServer
exports.config = {
    port: process.env.PORT,
    db: process.env.DB,
    dbConnection: process.env.HOST_CONNECTION_STRING,
    database: process.env.DB_NAME,
}