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
          LeavesGranted : {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          BalanceLeaves: {
            type: DataTypes.INTEGER
          },
          ApprovedLeaves : {
            type: DataTypes.INTEGER
          },
          LeaveDays: {
            type: DataTypes.INTEGER
          },
          LeaveFromDate: {
            type: DataTypes.DATE
          },
          LeaveToDate: {
            type: DataTypes.DATE
          },
          LeaveReason: {
            type: DataTypes.STRING
          },
          RejectedLeaves: {
            type: DataTypes.INTEGER
          },
          RejectedReason: {
            type: DataTypes.STRING
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
          }
    }

    const options = {
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt',
        indexes: [
            // Create a unique index on email
            {
                name: 'Leaves_empnumber_index',
                fields: ['Empnumber']
            }
        ]
    };

    return sequelize.define("Leaves", attributes, options);
}

module.exports = model;