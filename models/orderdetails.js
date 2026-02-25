'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderdetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      orderdetails.belongsTo(models.products,{
        foreignKey: 'product_id'
      });
      orderdetails.belongsTo(models.order,{
        foreignKey: 'order_id'
      })
    }
  }
  orderdetails.init({
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(18,0),
    quantity: DataTypes.INTEGER,
    create_at: DataTypes.DATE,
    update_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'orderdetails',
    tableName: 'orderdetails',
    underscored: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
  });
  return orderdetails;
};