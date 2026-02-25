'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bannerdetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      bannerdetails.belongsTo(models.products,{
        foreignKey: 'product_id'
      })
    }
  }
  bannerdetails.init({
    product_id: DataTypes.INTEGER,
    banner_id: DataTypes.INTEGER,
    create_at: DataTypes.DATE,
    update_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'bannerdetails',
    tableName: 'bannerdetails',
    underscored: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
  });
  return bannerdetails;
};