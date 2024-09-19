const { Sequelize, DataTypes } = require("sequelize");

const model = (sequelize) => {
    const attributes = {
        TimeentryId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        TimeIn: {
            type: DataTypes.STRING,
            allowNull: false
        },
        TimeOut: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        Empnumber: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        DayHrs: {
            type: DataTypes.STRING
        },
        IsDeleted: {
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
                name : 'empnumber_index',
                unique : true,
                fields: ['Empnumber']
            }
        ]
    };

    return sequelize.define("EmployeeTimeEntry", attributes, options);
}

module.exports = model;