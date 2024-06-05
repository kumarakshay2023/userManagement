const bcrypt  = require('bcrypt')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  
    await queryInterface.bulkInsert('Roles', [{
      role_name: 'Super Admin',
      privileges:['ALL_ACCESS'],
      createdAt: new Date(),
      updatedAt:new Date(),
   },
  {
    role_name: 'Admin',
    privileges: ['ORGANIZATION_MANAGEMENT', 'TASK_MANAGEMENT'],
    createdAt: new Date(),
    updatedAt:new Date(),
  },
  {
    role_name: 'User',
    privileges: ['TASK_MANAGEMENT'],
    createdAt: new Date(),
    updatedAt:new Date(),
  },
  {
    role_name: 'Viewer',
    privileges: ['VIEW'],
    createdAt: new Date(),
    updatedAt:new Date(),
  }
  
  
  ], {});
   
       await queryInterface.bulkInsert('Users', [{
        username: 'CEO',
        password:await bcrypt.hash('1234',10),
        role_id:1,
        createdAt: new Date(),
        updatedAt:new Date(),
     }], {});
   
    
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
  
};
