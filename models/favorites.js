'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class favorites extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      favorites.belongsTo(models.products,{
        foreignKey: 'product_id'
      }),
      favorites.belongsTo(models.users,{
        foreignKey: 'user_id'
      })
    }
  }
  favorites.init({
    product_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    create_at: DataTypes.DATE,
    update_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'favorites',
    tableName: 'favorites',
    underscoredl: true,
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
  });
  return favorites;
};