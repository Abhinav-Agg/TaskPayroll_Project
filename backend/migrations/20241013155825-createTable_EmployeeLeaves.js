'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('EmployeeLeaves', {
      EmployeeLeaveId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      Empnumber: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      LeavesGranted : {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      LeavesEffectiveFrom : {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      LeavesEffectiveTo : {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      IsActive : {
        type: Sequelize.TINYINT
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
      },
    });

    await queryInterface.addIndex('EmployeeLeaves', ['Empnumber'], {
      name: 'EmployeeLeaves_empnumber_index'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('EmployeeLeaves', 'EmployeeLeaves_empnumber_index');

    // Drop the Users table
    await queryInterface.dropTable('EmployeeLeaves');
  }
};
