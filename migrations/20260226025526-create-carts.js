'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products', // Trỏ tới bảng products trong Database
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Xóa sản phẩm thì tự động xóa luôn khỏi giỏ hàng
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Trỏ tới bảng users trong Database
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Xóa user thì tự động dọn sạch giỏ hàng của user đó
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1 // Mặc định khi thêm vào giỏ là 1
      },
      size: {
        type: Sequelize.STRING,
        allowNull: true // Cho phép null vì có thể có sản phẩm không có size
      },
      create_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      update_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Lệnh này dùng để xóa bảng nếu bạn chạy lệnh undo/rollback migration
    await queryInterface.dropTable('carts');
  }
};