const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const brcypt = require("bcrypt");
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const { Role, Organization, Users_Organizations, Task } = require("../models");

exports.loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username: username }, raw: true });
  if (!user) throw new ApiError("User not found", 400);
  const isPasswordValid = await brcypt.compare(password, user.password);
  if (!isPasswordValid) throw new ApiError("Invalid user credentials", 400);
  const token = jwt.sign(
    { user_id: user.user_id, username },
    process.env.JWT_SECRET
  );
  user.token = token;
  return res.status(200).json({
    success: true,
    data: user,
    msg: "User Login Successfully",
  });
});

exports.addUsers = asyncHandler(async (req, res) => {
  const { privileges, username, password, role_id } = req.body;
  const user = req.user;
  if (!username) throw new ApiError("Username must be provided", 400);
  if (!password) throw new ApiError("Password must be provided", 400);
  if (!role_id) throw new ApiError("Role is required", 400);
  if (!privileges) throw new ApiError("privileges must be provided", 400);
  const role = await Role.findOne({ where: { role_id: role_id } });
  if (!role) throw new ApiError("Role not found", 400);
  const userPrivileges = await Role.findOne({
    where: { role_id: user.role_id },
  });

  if (!userPrivileges) throw new ApiError("Role not found", 400);
  if (!userPrivileges.privileges.includes(privileges))
    throw new ApiError("User don't have access", 400);

  const findUser = await User.findOne({ where: { username: username } });
  if (findUser) throw new ApiError("User already exists", 400);
  const hashPassword = await brcypt.hash(password, 10);
  await User.create({
    username: username,
    password: hashPassword,
    role_id: role_id,
  });
  return res.status(200).json({
    success: true,
    msg: "User Added Successfully",
  });
});

exports.addOrganisation = asyncHandler(async (req, res) => {
  const { org_name, privileges } = req.body;
  const user = req.user;
  const userPrivileges = await Role.findOne({
    where: { role_id: user.role_id },
  });
  if (!privilages) throw new ApiError("privileges must be provided", 400);
  if (!userPrivileges) throw new ApiError("Role not found", 400);
  if (!userPrivileges.privileges.includes(privileges))
    throw new ApiError("User don't have access", 400);
  const checkOrganisation = await Organization.findOne({
    where: { org_name: org_name },
  });
  if (checkOrganisation) throw new ApiError("Organisation already exists", 400);
  await Organization.create({ org_name: org_name });
  return res.status(200).json({
    success: true,
    msg: "Organisation Added Successfully",
  });
});

exports.addUsersToOrganisation = asyncHandler(async (req, res) => {
  const { user_id, privileges, org_id } = req.body;
  const user = req.user;
  if (!user_id) throw new ApiError("User must be provided ", 400);
  if (!privileges) throw new ApiError("privileges must be provided", 400);
  if (!org_id) throw new ApiError("organistion must be provided", 400);
  const userPrivileges = await Role.findOne({
    where: { role_id: user.role_id },
  });

  if (!userPrivileges) throw new ApiError("Role not found", 400);
  if (!userPrivileges.privileges.includes(privileges))
    throw new ApiError("User don't have access", 400);
  const checkUser = await User.findOne({ where: { user_id: user_id } });
  if (!checkUser) throw new ApiError("User not found", 400);
  const checkUserInOrganization = await Users_Organizations.findOne({
    where: { user_id: user_id, org_id: org_id },
  });
  if (checkUserInOrganization)
    throw new ApiError("User already exists to organisation", 400);
  console.log("User", user_id);
  await Users_Organizations.create({
    user_id: user_id,
    org_id: org_id,
  });
  return res.status(200).json({
    success: true,
    msg: "User added to Organisation Successfully",
  });
});

exports.addTaskToOrganization = asyncHandler(async (req, res) => {
  const { task_name, creation_date, completion_date, privileges } = req.body;
  const user = req.user;
  if (!task_name) throw new ApiError("Task name must be provided", 400);
  if (!creation_date) throw new ApiError("Creation date must be provided", 400);
  if (!completion_date)
    throw new ApiError("Completion date must be provided", 400);
  const checkUserOrganization = await Users_Organizations.findOne({
    where: { user_id: user.user_id },
  });
  if (!checkUserOrganization)
    throw new ApiError("user not belongs to particular orginization", 400);
  const userPrivileges = await Role.findOne({
    where: { role_id: user.role_id },
  });
  if (!userPrivileges.privileges.includes(privileges))
    throw new ApiError("User don't have access to create tasks", 400);
  await Task.create({
    task_name: task_name,
    creation_date: creation_date,
    completion_date: completion_date,
    creator_user_id: user.user_id,
    org_id: checkUserOrganization.org_id,
  });
  return res.status(200).json({
    success: true,
    msg: "task added to Organisation Successfully",
  });
});

exports.getTasksForOrganizations = asyncHandler(async (req, res) => {
  const { org_id } = req.body;
  const taskData = await Task.findAll({ where: { org_id: org_id } });
  if (!taskData) throw new ApiError("No task found", 400);
  return res.status(200).json({
    success: true,
    data: taskData,
  });
});

exports.switchOriganisation = asyncHandler(async (req, res) => {
  const { org_id, privileges } = req.body;
  const user = req.user;
  const {
    cookie: { _expires },
  } = req.session;
  if (Date.now() > _expires)
    throw new ApiError("Session expired please login again", 400);

  if (!org_id) throw new ApiError("Organisation must be provided", 400);
  if (!privileges) throw new ApiError("Privileges must be provided", 400);
  const checkUserOrganization = await Users_Organizations.findOne({
    where: { user_id: user.user_id, org_id: org_id },
  });
  if (!checkUserOrganization)
    throw new ApiError("You cannot switch to organization", 400);
  return res.status(200).json({
    success: true,
    msg: "Successfully switched to organisation",
  });
});
