const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Role = sequelize.define('Role', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  privileges: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
});

module.exports = Role;
