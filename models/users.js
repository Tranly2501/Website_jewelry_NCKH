'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasMany(models.order,{
        foreignKey: 'user_id'
      });
      users.hasMany(models.favorites,{
        foreignKey: 'user_id'
      });
      users.hasMany(models.feedback,{
        foreignKey: 'user_id'
      })
    }
  }
  users.init({
    username: DataTypes.STRING(150),
    email: DataTypes.STRING,
    password: DataTypes.STRING(150),
    avatar: DataTypes.TEXT,
    phone: DataTypes.STRING(20),
    create_at: DataTypes.DATE,
    update_at: DataTypes.DATE,
    role: {
      type: DataTypes.STRING(20),
      defaultValue: 'user', 
      allowNull: false
    },
  }, 
  {
    sequelize,
    modelName: 'users',
    tableName: 'users',
    underscored: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
  });
  return users;
};