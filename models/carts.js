'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class carts extends Model {
    static associate(models) {
      carts.belongsTo(models.users, { foreignKey: 'user_id',as: 'productData' });
      carts.hasMany(models.cartdetails, { foreignKey: 'cart_id', as: 'cartItemData' });
    }
  }
  
  carts.init({
    user_id: DataTypes.INTEGER,
    product_quantity: DataTypes.INTEGER 
  }, {
    sequelize,
    modelName: 'carts',
    tableName: 'carts',
    underscored: false,
    // THÊM 3 DÒNG DƯỚI ĐÂY ĐỂ ÉP TÊN CỘT CHO ĐÚNG VỚI DB
    timestamps: true, 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt'  
  });
  
  return carts;
};