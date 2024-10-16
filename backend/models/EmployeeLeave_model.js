const { Sequelize, DataTypes } = require("sequelize");

const model = (sequelize) => {
    const attributes = {
        EmployeeLeaveId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        Empnumber: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        LeavesGranted: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        LeavesEffectiveFrom: {
            allowNull: false,
            type: DataTypes.DATE
        },
        LeavesEffectiveTo: {
            allowNull: false,
            type: DataTypes.DATE
        },
        IsActive: {
            type: DataTypes.TINYINT
        },
        CreatedBy: {
            type: DataTypes.BIGINT
        },
        ModifiedBy: {
            type: DataTypes.BIGINT
        },
        IsDeleted: {
            type: DataTypes.TINYINT
        },
        DeletedBy: {
            type: DataTypes.BIGINT
        },
        CreatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        UpdatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
    }

    // Here index is not unique beacuse we store
    const options = {
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
        indexes: [
            // Create a unique index on email
            {
                name: 'EmployeeLeaves_empnumber_index',
                fields: ['Empnumber']
            }
        ]
    };

    let EmployeeLeaves = sequelize.define("EmployeeLeaves", attributes, options);

    EmployeeLeaves.associate = (models) => {
        EmployeeLeaves.hasMany(models.Leaves, { foreignKey: 'EmployeeLeaveId'});
    };

    return EmployeeLeaves;
}

module.exports = model;