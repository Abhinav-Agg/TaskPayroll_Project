'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Employee', {
      EmpId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      FullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Empnumber: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      Email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      UserId: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Users', // Target model name (replace with your actual model)
          key: 'UserId' // Target model's primary key column (replace if different)
        }
        // When we create foreign key column usign same datatype.
      },
      IsDeleted: {
        type: Sequelize.TINYINT
      },
      IsActive: {
        type: Sequelize.TINYINT
      },
      EmpDepartment: {
        type: Sequelize.STRING,
        allowNull: false
      },
      EmpDesignation: {
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

    await queryInterface.addIndex('Employee', ['Email', "Empnumber", "UserId"], {
      name: 'email_empnumber_userId_unique_index', 
      unique: true, // To ensure the index is unique
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Employee', 'email_empnumber_userId_unique_index');

    // Drop the Users table
    await queryInterface.dropTable('Employee');
  }
};
