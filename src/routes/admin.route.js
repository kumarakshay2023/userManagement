const express = require('express');
const { addUsers,loginUser,addOrganisation, addUsersToOrganisation, addTaskToOrganization, getTasksForOrganizations, switchOriganisation } = require('../controllers/admin.controller');
const { auth } = require('../middlewares/auth');


const router = express.Router();

router.post("/login",loginUser)
router.post('/sub-admin/add',auth,addUsers);
router.post('/organisation/add',auth,addOrganisation)
router.post('/user-organisation/add',auth,addUsersToOrganisation)
router.post('/task-add',auth,addTaskToOrganization)
router.get("/tasks",getTasksForOrganizations)
router.put("/switch-organisation",auth,switchOriganisation);

module.exports = router