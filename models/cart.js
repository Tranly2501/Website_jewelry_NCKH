'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    static associate(models) {
      // Liên kết với bảng Products
      cart.belongsTo(models.products, {
        foreignKey: 'product_id',
        as: 'product' // Đặt bí danh để xuất JSON đẹp hơn cho React
      });
      
      // Liên kết với bảng Users
      cart.belongsTo(models.users, {
        foreignKey: 'user_id'
      });
    }
  }

  cart.init({
    product_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER, // ĐÃ THÊM: Cần thiết cho giỏ hàng
    size: DataTypes.STRING,      // ĐÃ THÊM: Cần thiết để lưu size
    

  }, {
    sequelize,
    modelName: 'cart',
    tableName: 'carts',
    underscored: true, 
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
  });

  return cart;
};