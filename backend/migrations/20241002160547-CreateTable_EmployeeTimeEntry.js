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
      Empnumber: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      TimeIn: {
        type: Sequelize.STRING
      },
      TimeOut: {
        type: Sequelize.STRING
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
      Created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      Updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      ModifiedBy: {
        type: Sequelize.BIGINT
      },
      IsDeleted: {
        type: Sequelize.TINYINT
      },
      DeletedBy : {
        type: Sequelize.BIGINT
      },
      ModifiedReason: {
        type: Sequelize.STRING
      }
      
    });

    await queryInterface.addIndex('EmployeeTimeEntry', ['Empnumber'], {
      name: 'empnumber_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('EmployeeTimeEntry', 'empnumber_index');

    // Drop the Users table
    await queryInterface.dropTable('EmployeeTimeEntry');
  }
};
