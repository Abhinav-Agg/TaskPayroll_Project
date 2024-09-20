'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
      LeavesApproved : {
        type: Sequelize.INTEGER
      },
      LeaveDays: {
        type: Sequelize.INTEGER
      },
      CreatedBy: {
        type: Sequelize.BIGINT,
      },
      ModifiedBy: {
        type: Sequelize.BIGINT,
      },
      IsDeleted: {
        type: Sequelize.TINYINT
      },

      // Add createdAt and updatedAt columns
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('Leaves', ['Empnumber'], {
      name: 'empnumber_index',
      unique: true, // To ensure the index is unique
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Leaves', 'empnumber_index');

    // Drop the Users table
    await queryInterface.dropTable('Leaves');
  }
};
