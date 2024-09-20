'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmployeeTimeEntry', {
      TimeentryId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      TimeIn: {
        type: Sequelize.STRING,
        allowNull: false
      },
      TimeOut: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      Empnumber: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      DayHrs: {
        type: Sequelize.STRING
      },
      TimeEntrySubmitted: {
        type: Sequelize.TINYINT
      },
      CreatedBy: {
        type: Sequelize.BIGINT
      },
      ModifiedBy: {
        type: Sequelize.BIGINT
      },
      ModifiedReason: {
        type: Sequelize.STRING
      },
      IsDeleted: {
        type: Sequelize.TINYINT
      },
      DeletedBy : {
        type: Sequelize.BIGINT
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

    await queryInterface.addIndex('EmployeeTimeEntry', ['Empnumber'], {
      name: 'empnumber_index',
      unique: true, // To ensure the index is unique
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('EmployeeTimeEntry', 'empnumber_index');

    // Drop the Users table
    await queryInterface.dropTable('EmployeeTimeEntry');
  }
};
