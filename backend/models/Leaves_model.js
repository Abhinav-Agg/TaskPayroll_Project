const { Sequelize, DataTypes } = require("sequelize");

const model = (sequelize) => {
    const attributes = {
        LeaveId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        LeaveType: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        Empnumber: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        Days: {
            type: DataTypes.INTEGER,
            allowNull: false
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
                fields: ['Empnumber']
            }
        ]
    };

    return sequelize.define("Leaves", attributes, options);
}

module.exports = model;