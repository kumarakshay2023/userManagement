const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Session = sequelize.define('Session', {
  session_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  login_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  logout_time: {
    type: DataTypes.DATE
  }
});

module.exports = Session;
