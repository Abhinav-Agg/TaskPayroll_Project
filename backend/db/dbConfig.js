const { Sequelize } = require("sequelize");
const config = require("../config/config");
const { development, production } = config;

const envType = process.env.NODE_ENV === "development" ? development : production;

//Create Connection.
const sequelize = new Sequelize(
    envType.database,
    envType.username,
    envType.password,
    {
        host: envType.host,
        dialect: envType.dialect,
        sql_port : envType.SQL_PORT
    }
);
 
// Check the connection.
const dbConnection = async () => {
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully!');
    }
    catch(err){
        console.log('Can\'t establish database connection:\n' + err);
      }
}

module.exports = sequelize;