'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Employee', 'EmpRole', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Employee', 'ModifiedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Employee', 'ModifiedBy', {
      type: Sequelize.BIGINT,
      allowNull: true
    });

    await queryInterface.addColumn('Employee', 'DeletedBy', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove the column 'description' if the migration is rolled back
    await queryInterface.removeColumn('Employee', 'EmpRole');
    await queryInterface.removeColumn('Employee', 'ModifiedAt');
    await queryInterface.removeColumn('Employee', 'ModifiedBy');
    await queryInterface.removeColumn('Employee', 'DeletedBy');
  }
};
