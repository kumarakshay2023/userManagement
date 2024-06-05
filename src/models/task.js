const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Task = sequelize.define('Task', {
  task_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  task_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  creation_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  completion_date: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  }
});

module.exports = Task;
