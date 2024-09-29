const { Sequelize, DataTypes } = require("sequelize");

const model = (sequelize) => {
  const attributes = {
    TaskId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    Empnumber: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    TaskName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    TaskDescription: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    Hours: {
      type: DataTypes.STRING
    },
    IsDeleted: {
      type: DataTypes.TINYINT
    },
    DeleteBy: {
      type: DataTypes.BIGINT
    },
    CreatedBy: {
      type: DataTypes.BIGINT
    },
    ModifiedBy: {
      type: DataTypes.BIGINT
    },
  }

  const options = {
    freezeTableName: true,
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
  };

  const Task = sequelize.define("Task", attributes, options);

  Task.associate = (models) => {
    Task.belongsTo(models.Employee, { foreignKey: 'Empnumber', targetKey: 'Empnumber' });
    // Here, we define a foreign key in Sequelize, but it does not impact the actual database schema.
    // This association is used for joins and ensures that Sequelize uses the 'Empnumber' column for both tables during insertion and updates.
  };

  return Task;
}

module.exports = model;