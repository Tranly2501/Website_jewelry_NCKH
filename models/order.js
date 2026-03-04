'use strict';
const {
  Model,
  or
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order.belongsTo(models.users,{
        foreignKey: 'user_id'
      });
      order.hasMany(models.orderdetails,{
        foreignKey: 'order_id'
      });
      order.belongsTo(models.discounts, { foreignKey: 'discount_id' });
      order.belongsTo(models.shippinginformation, { foreignKey: 'ship_id'})
    }
  }
  order.init({
    user_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    note: DataTypes.TEXT,
    basePrice: DataTypes.DECIMAL(18,0),
    discount_id: DataTypes.INTEGER,
    discount_amount: DataTypes.DECIMAL(10,3),
    totalPrice: DataTypes.DECIMAL(18,0),
    create_at: DataTypes.DATE,
    update_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'order',
    tableName: 'orders',
    underscored: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
  });
  return order;
};