const { Sequelize, DataTypes } = require("sequelize");

const model = (sequelize) => {
  const attributes = {
    LeaveId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    EmployeeLeaveId: {
      type: DataTypes.BIGINT,
      references: {
        model: 'EmployeeLeaves', // Target model name (replace with your actual model)
        key: 'EmployeeLeaveId' // Target model's primary key column (replace if different)
      }
    },
    LeaveType: {
      type: DataTypes.STRING(100)
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
    BalanceLeaves: {
      type: DataTypes.INTEGER
    },
    ApprovedLeaves : {
      type: DataTypes.INTEGER
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
    },
    CreatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    UpdatedAt: {
      allowNull: false,
      type: DataTypes.DATE
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

  let Leaves = sequelize.define("Leaves", attributes, options);

  Leaves.associate = (models) => {
    Leaves.belongsTo(models.EmployeeLeaves, { foreignKey: 'EmployeeLeaveId'});
  };

  return Leaves;
}

module.exports = model;