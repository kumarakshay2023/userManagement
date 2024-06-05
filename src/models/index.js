const sequelize = require("../db/conn");

const User = require("./user");
const Organization = require("./organization");
const Role = require("./role");
const Session = require("./session");
const Task = require("./task");
const Users_Organizations = require('./users_organizations')


User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

User.belongsToMany(Organization, { through: 'Users_Organizations', foreignKey: 'user_id' });
Organization.belongsToMany(User, { through: 'Users_Organizations', foreignKey: 'org_id' });

Session.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Session, { foreignKey: 'user_id' });

Task.belongsTo(User, { foreignKey: 'creator_user_id' });
User.hasMany(Task, { foreignKey: 'creator_user_id' });

Task.belongsTo(Organization, { foreignKey: 'org_id' });
Organization.hasMany(Task, { foreignKey: 'org_id' });

sequelize.sync({ force: false, logging: false }).catch((err) => console.log(err));

module.exports = {
  User,
  Organization,
  Role,
  Session,
  Task,
  Users_Organizations
};
