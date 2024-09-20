'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Task', {
      TaskId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      TaskName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Empnumber: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      Hours: {
        type: Sequelize.STRING
      },
      IsDeleted: {
        type: Sequelize.TINYINT
      },
      DeleteBy: {
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

    await queryInterface.addIndex('Task', ['Empnumber'], {
      name: 'empnumber_index',
      unique: true, // To ensure the index is unique
    });

    await queryInterface.addIndex('Task', ['TaskName'], {
      name: 'TaskName_nonunique_index', // Optional: name of the index
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Task', 'taskname_empnumber_index');

    // Drop the Users table
    await queryInterface.dropTable('Task');
  }
};
