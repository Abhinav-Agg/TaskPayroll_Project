const { Sequelize, DataTypes } = require("sequelize");


const model = (sequelize) => {
    const attributes = {
        EmpId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        FullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Empnumber : {
            type : DataTypes.BIGINT
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        UserId: {
            type: DataTypes.BIGINT,
            references: {
                model: 'Users', // Target model name (replace with your actual model)
                key: 'UserId' // Target model's primary key column (replace if different)
            }
        },
        EmpRole : {
            type: DataTypes.STRING
        },
        ModifiedAt : {
            type: DataTypes.STRING
        },
        ModifiedBy : {
            type: DataTypes.STRING
        },
        IsDeleted: {
            type: DataTypes.TINYINT
        },
        DeletedBy : {
            type: DataTypes.STRING
        },
        IsActive: {
            type: DataTypes.TINYINT
        },
        EmpDepartment: {
            type: DataTypes.STRING,
            allowNull: false
        },
        EmpDesignation: {
            type: DataTypes.STRING,
            allowNull: false
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
                name : 'userId_empnumber_email_index',
                unique: true,
                fields: ['Email', "UserId", "Empnumber"]
            }
        ]
    };

    return sequelize.define("Employee", attributes, options);
}

module.exports = model;