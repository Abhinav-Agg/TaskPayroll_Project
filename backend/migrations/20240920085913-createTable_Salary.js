'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Salary', {
      SalaryId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      Empnumber: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      CTC: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Basic: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      HRA: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      DA: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      PF: {
        type: Sequelize.BIGINT
      },
      // Both columns value we are using may be EmpId or userId
      CreatedBy: {
        type: Sequelize.BIGINT,
      },
      ModifiedBy: {
        type: Sequelize.BIGINT,
      },
      ModifyReason: {
        type: Sequelize.STRING
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
  },

  async down(queryInterface, Sequelize) {
    // Drop the Users table
    await queryInterface.dropTable('Salary');
  }
};
