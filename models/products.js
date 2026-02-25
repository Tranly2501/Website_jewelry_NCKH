'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      products.belongsTo(models.categories,{
        foreignKey: 'category_id'
      });
      products.hasMany(models.favorites,{
        foreignKey: 'product_id'
      });
      products.hasMany(models.orderdetails,{
        foreignKey: 'product_id'
      });
      products.hasMany(models.feedback, {
        foreignKey: 'product_id'
      })
    }
  }
  products.init({
    name: DataTypes.STRING(200),
    description: DataTypes.TEXT,
    descriptionDetail: {
    type: DataTypes.TEXT, 
    field: 'descriptionDetail' 
  },
    price: DataTypes.DECIMAL(18,0),
    oldprice: DataTypes.DECIMAL(18,0),
    category_id: DataTypes.INTEGER,
    specification: DataTypes.TEXT,
    image_url: DataTypes.TEXT,
    byturn: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    status: DataTypes.JSON,
    create_at: DataTypes.DATE,
    update_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'products',
    tableName: 'products',
    underscored: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
  });
  return products;
};