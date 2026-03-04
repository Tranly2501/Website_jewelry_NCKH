
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shippinginformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      shippinginformation.hasMany(models.order, {
        foreignKey: 'ship_id'
      })
    }
  }
  shippinginformation.init({
    firstName: DataTypes.STRING(100),
    lastName: DataTypes.STRING(100),
    address: DataTypes.STRING(255),
    phone: DataTypes.STRING(20),
    email: DataTypes.STRING(255)
  }, {
    sequelize,
    modelName: 'shippinginformation',
    tableName: 'shippinginformations',
    underscored: true
  });
  return shippinginformation;
};