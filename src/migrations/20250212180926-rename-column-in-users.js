'use strict';

import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('User', 'created_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('User', 'updated_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    });

    await queryInterface.sequelize.query(
      `UPDATE User SET created_at = create_at, updated_at = update_at WHERE create_at IS NOT NULL;`
    );

    await queryInterface.removeColumn('User', 'create_at');
    await queryInterface.removeColumn('User', 'update_at');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('User', 'create_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('User', 'update_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    });

    await queryInterface.sequelize.query(
      `UPDATE User SET create_at = created_at, update_at = updated_at WHERE created_at IS NOT NULL;`
    );

    await queryInterface.removeColumn('User', 'created_at');
    await queryInterface.removeColumn('User', 'updated_at');
  },
};
