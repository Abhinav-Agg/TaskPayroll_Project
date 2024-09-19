const { Sequelize, DataTypes } = require("sequelize");


const model = (sequelize) => {
    const attributes = {
        UserId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        Fullname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        UserEmail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        UserLogin : {
            type : DataTypes.STRING,
            allowNull : false
        },
        Password : {
            type : DataTypes.STRING,
            allowNull : false
        },
        RefreshToken : {
            type : DataTypes.STRING
        },
        Blocked : {
            type: DataTypes.TINYINT
        },
        IsDeleted: {
            type: DataTypes.TINYINT
        },
        IsActive: {
            type: DataTypes.TINYINT
        }
    }

    const options = {
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            // Create a unique index on email
            {
                name : 'useremail_index',
                unique: true,
                fields: ['UserEmail']
            }
        ]
    };

    return sequelize.define("Users", attributes, options);
}

module.exports = model;