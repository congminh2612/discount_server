'use strict';

import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Đổi tên createdAt -> create_at
    await queryInterface.renameColumn('Users', 'createdAt', 'create_at');
    // Đổi tên updatedAt -> update_at
    await queryInterface.renameColumn('Users', 'updatedAt', 'update_at');

    // Thêm giá trị mặc định
    await queryInterface.changeColumn('Users', 'create_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.changeColumn('Users', 'update_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    });
  },

  async down(queryInterface, Sequelize) {
    // Quay lại tên cũ nếu rollback
    await queryInterface.renameColumn('Users', 'create_at', 'createdAt');
    await queryInterface.renameColumn('Users', 'update_at', 'updatedAt');

    // Xóa giá trị mặc định
    await queryInterface.changeColumn('Users', 'createdAt', {
      type: DataTypes.DATE,
      allowNull: false,
    });

    await queryInterface.changeColumn('Users', 'updatedAt', {
      type: DataTypes.DATE,
      allowNull: false,
    });
  },
};
