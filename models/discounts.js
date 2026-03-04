'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class discounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      discounts.hasMany(models.order, { foreignKey: 'discount_id'})
    }
  }
  discounts.init({
    code: DataTypes.STRING,
    value: DataTypes.DECIMAL(10,3),
    min_order_price: DataTypes.DECIMAL(18,3)
  }, {
    sequelize,
    modelName: 'discounts',
    tableName: 'dicounts',
    underscored: true
  });
  return discounts;
};