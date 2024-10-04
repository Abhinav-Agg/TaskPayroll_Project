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
            type: DataTypes.STRING
        },
        TimeOut: {
            type: DataTypes.STRING
        },
        Empnumber: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        DayHrs: {
            type: DataTypes.STRING
        },
        TimeEntrySubmitted: {
            type: DataTypes.TINYINT
        },
        // Both columns value we are using may be EmpId or userId
        CreatedBy: {
            type: DataTypes.BIGINT,
        },
        ModifiedBy: {
            type: DataTypes.BIGINT,
        },
        ModifiedReason: {
            type: DataTypes.STRING,
        },
        IsDeleted: {
            type: DataTypes.TINYINT
        },
        DeletedBy : {
          type: DataTypes.BIGINT
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
                name: 'empnumber_index',
                unique: true,
                fields: ['Empnumber']
            }
        ]
    };

    return sequelize.define("EmployeeTimeEntry", attributes, options);
}

module.exports = model;