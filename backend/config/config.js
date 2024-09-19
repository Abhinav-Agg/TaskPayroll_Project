const {USER, PASSWORD, DB, HOST, DIALECT, SQL_PORT} = process.env;

module.exports = {
    development: {
        "username": USER,
        "password": PASSWORD,
        "database": DB,
        "host": HOST,
        "dialect": DIALECT,
        "SQL_PORT": SQL_PORT
    },
    production: {
        "username": USER,
        "password": PASSWORD,
        "database": DB,
        "host": HOST,
        "dialect": DIALECT,
        "SQL_PORT": SQL_PORT
    }
}