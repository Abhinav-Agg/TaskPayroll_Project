'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      UserId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      Fullname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      UserEmail: {
        type: Sequelize.STRING,
        allowNull: false
      },
      UserLogin: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      RefreshToken: {
        type: Sequelize.STRING
      },
      Blocked: {
        type: Sequelize.TINYINT
      },
      IsDeleted: {
        type: Sequelize.TINYINT
      },
      IsActive: {
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

    await queryInterface.addIndex('Users', ['UserEmail'], {
      name: 'useremail_unique_index', 
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeIndex('Users', 'useremail_unique_index');

    // Drop the Users table
    await queryInterface.dropTable('Users');
  }
};
