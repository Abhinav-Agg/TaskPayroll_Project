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
        LeavesGranted: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        LeavesApproved: {
            type: Sequelize.INTEGER
        },
        // Leave Days -> Its used how much days Employee applied for leaves.
        LeaveDays: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        // Both columns value we are using may be EmpId or userId
        CreatedBy: {
            type: DataTypes.BIGINT,
        },
        ModifiedBy: {
            type: DataTypes.BIGINT,
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
                name: 'empnumber_index',
                fields: ['Empnumber']
            }
        ]
    };

    return sequelize.define("Leaves", attributes, options);
}

module.exports = model;