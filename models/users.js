'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      users.hasMany(models.order, { foreignKey: 'user_id' });
      users.hasMany(models.favorites, { foreignKey: 'user_id' });
      users.hasMany(models.feedback, { foreignKey: 'user_id' });
      users.hasOne(models.carts, { foreignKey: 'user_id' }); 
    }
  }
  
  users.init({
    firstName: {
      type: DataTypes.STRING(100),
      field: 'firstName' 
    },
    lastName: {
      type: DataTypes.STRING(100),
      field: 'lastName' 
    },
    username: DataTypes.STRING(150),
    email: DataTypes.STRING,
    password: DataTypes.STRING(150),
    avatar: DataTypes.TEXT,
    phone: DataTypes.STRING(20),
    role: DataTypes.STRING(20)
  }, 
  {
    sequelize,
    modelName: 'users',
    tableName: 'users',
    underscored: true,
    // --- PHẦN OPTIONS CHỈ DÀNH CHO TIMESTAMPS ---
    timestamps: true, 
    createdAt: 'create_at',
    updatedAt: 'update_at'
  });
  
  return users;
};