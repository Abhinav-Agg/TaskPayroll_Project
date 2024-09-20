const { Sequelize, DataTypes } = require("sequelize");

const model = (sequelize) => {
    const attributes = {
        SalaryId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        Empnumber: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        CTC: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Basic: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        HRA: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        DA: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        PF: {
            type: DataTypes.BIGINT
        },
        // Both columns value we are using may be EmpId or userId
        CreatedBy : {
            type : DataTypes.BIGINT,
        },
        ModifiedBy : {
            type : DataTypes.BIGINT,
        },
        ModifyReason : {
            type :  DataTypes.STRING
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
        updatedAt: 'updated_at'
    };

    return sequelize.define("Salary", attributes, options);
}

module.exports = model;