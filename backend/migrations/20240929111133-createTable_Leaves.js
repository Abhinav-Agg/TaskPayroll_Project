'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Leaves', {
      LeaveId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      LeaveType: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      Empnumber: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      LeavesGranted : {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      BalanceLeaves: {
        type: Sequelize.INTEGER
      },
      ApprovedLeaves : {
        type: Sequelize.INTEGER
      },
      LeaveDays: {
        type: Sequelize.INTEGER
      },
      LeaveFromDate: {
        type: Sequelize.DATE
      },
      LeaveToDate: {
        type: Sequelize.DATE
      },
      LeaveReason: {
        type: Sequelize.STRING
      },
      RejectedLeaves: {
        type: Sequelize.INTEGER
      },
      RejectedReason: {
        type: Sequelize.STRING
      },
      CreatedBy: {
        type: Sequelize.BIGINT
      },
      ModifiedBy: {
        type: Sequelize.BIGINT
      },
      IsDeleted: {
        type: Sequelize.TINYINT
      },
      DeletedBy: {
        type: Sequelize.BIGINT
      },
      // Add createdAt and updatedAt columns
      CreatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.Now
      },
      UpdatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('Leaves', ['Empnumber'], {
      name: 'Leaves_empnumber_index',
      unique: true, // To ensure the index is unique
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Leaves', 'Leaves_empnumber_index');

    // Drop the Users table
    await queryInterface.dropTable('Leaves');
  }
};
