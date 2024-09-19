const { Sequelize, DataTypes } = require("sequelize");

const model = (sequelize) => {
    const attributes = {
        TaskId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        TaskName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Empnumber: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        Hours: {
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
                name : 'taskname_empnumber_index',
                fields: ['Empnumber', "TaskName"]
            }
        ]
    };

    return sequelize.define("Task", attributes, options);
}

module.exports = model;