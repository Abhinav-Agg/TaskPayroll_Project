const { Sequelize, DataTypes } = require("sequelize");

const model = (sequelize) => {
    const attributes = {
        UserRoleId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        UserId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        Role: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }

    const options = {
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };

    return sequelize.define("UserRole", attributes, options);
}

module.exports = model;