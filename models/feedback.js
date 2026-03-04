'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      feedback.belongsTo(models.products,{
        foreignKey: 'product_id'
      });
      feedback.belongsTo(models.users, {
        foreignKey: 'user_id', as: 'userData'
      })
    }
  }
  feedback.init({
    product_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    star: DataTypes.INTEGER,
    context: DataTypes.TEXT,
    create_at: DataTypes.DATE,
    update_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'feedback',
    tableName: 'feedbacks',
    underscored: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
  });
  return feedback;
};