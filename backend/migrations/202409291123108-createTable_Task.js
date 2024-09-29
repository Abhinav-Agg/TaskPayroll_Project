'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Task', {
      TaskId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      Empnumber: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      TaskName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      TaskDescription: {
        type: Sequelize.STRING(1000),
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
      CreatedBy: {
        type: Sequelize.BIGINT
      },
      ModifiedBy: {
        type: Sequelize.BIGINT
      },
      // Add createdAt and updatedAt columns
      CreatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      UpdatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('Task', ['TaskName', "Empnumber"], {
      name: 'TaskName_Empnumber_nonunique_index', // Optional: name of the index
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Task', 'TaskName_Empnumber_nonunique_index');

    // Drop the Users table
    await queryInterface.dropTable('Task');
  }
};
