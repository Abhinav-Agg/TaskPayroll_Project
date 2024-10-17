'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Leaves', 'LeaveStatus', {
      type: Sequelize.STRING(10),
      allowNull: true
    });

    await queryInterface.addColumn('Leaves', 'ApprovedBy', {
      type: Sequelize.BIGINT,
      allowNull: true
    });

    await queryInterface.addColumn('Leaves', 'RejectedBy', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.addColumn('Leaves', 'RejectedReason', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Leaves', 'LeaveStatus');
    await queryInterface.removeColumn('Leaves', 'ApprovedBy');
    await queryInterface.removeColumn('Leaves', 'RejectedBy');
    await queryInterface.removeColumn('Leaves', 'RejectedReason');

  }
};
