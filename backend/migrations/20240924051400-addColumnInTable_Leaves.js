'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Leaves', 'RejectedReason', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Leaves', 'RejectedLeaves', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Leaves', 'DeletedBy', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Leaves', 'RejectedReason');
    await queryInterface.removeColumn('Leaves', 'RejectedLeaves');
    await queryInterface.removeColumn('Leaves', 'DeletedBy');
  }
};
