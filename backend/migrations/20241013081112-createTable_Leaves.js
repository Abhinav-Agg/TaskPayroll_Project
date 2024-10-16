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
      EmployeeLeaveId: {
        type: Sequelize.BIGINT,
        references: {
          model: 'EmployeeLeaves', // Target model name (replace with your actual model)
          key: 'EmployeeLeaveId' // Target model's primary key column (replace if different)
        }
      },
      LeaveType: {
        type: Sequelize.STRING(100)
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
      BalanceLeaves: {
        type: Sequelize.INTEGER
      },
      ApprovedLeaves : {
        type: Sequelize.INTEGER
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
      CreatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      UpdatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('Leaves', ['EmployeeLeaveId'], {
      name: 'Leaves_employeeleaveId_index'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Leaves', 'Leaves_employeeleaveId_index');

    // Drop the Users table
    await queryInterface.dropTable('Leaves');
  }
};
