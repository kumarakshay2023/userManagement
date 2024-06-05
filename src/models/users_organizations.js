const { DataTypes } = require("sequelize");
const sequelize = require("../db/conn");

const Users_Organizations = sequelize.define("Users_Organizations", {});

module.exports = Users_Organizations;
