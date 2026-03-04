'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cartdetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      cartdetails.belongsTo(models.carts, { foreignKey: 'cart_id' });
      cartdetails.belongsTo(models.products, { foreignKey: 'product_id'})
    }
  }
  cartdetails.init({
    cart_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    size: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(18,3)
  }, {
    sequelize,
    modelName: 'cartdetails',
    tableName: 'cartdetails',
    underscored: false
  });
  return cartdetails;
};