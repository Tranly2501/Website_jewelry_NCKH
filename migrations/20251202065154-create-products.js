'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      descriptionDetail: {
        type: Sequelize.TEXT,
        
      },
      price: {
        type: Sequelize.DECIMAL(18,0)
      },
      oldprice: {
        type: Sequelize.DECIMAL(18,0)
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id'
        }
      },
      specification: {
        type: Sequelize.JSON
      },
      image_url: {
        type: Sequelize.JSON
      },
      byturn: {
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.JSON
        
      },
      model_url: {
        type: Sequelize.STRING
      },
      create_at: {
        type: Sequelize.DATE
      },
      update_at: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
   await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // 2. Thực hiện xóa bảng products
    await queryInterface.dropTable('products');
    
    // 3. Bật lại cơ chế kiểm tra ngay lập tức để bảo vệ các bảng khác
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
};