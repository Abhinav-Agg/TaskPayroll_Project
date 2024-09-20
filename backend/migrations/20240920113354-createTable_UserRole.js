'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserRole', {
      UserRoleId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      UserId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      Role: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('UserRole');
  }
};
