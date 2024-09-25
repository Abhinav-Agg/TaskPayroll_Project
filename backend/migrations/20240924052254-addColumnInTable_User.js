'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'ModifiedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'ModifiedBy', {
      type: Sequelize.BIGINT,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'DeletedBy', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'DeletedBy');
    await queryInterface.removeColumn('Users', 'ModifiedAt');
    await queryInterface.removeColumn('Users', 'ModifiedBy');
  }
};
