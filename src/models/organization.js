const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Organization = sequelize.define('Organization', {
  org_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  org_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Organization;
