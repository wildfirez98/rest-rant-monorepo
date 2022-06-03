'use strict';
const bcrypt = require('bcrypt');
const { query } = require('express');
// Seeder file to create an 'admin' account since our API will not allow us to create anything other than a 'reviewer'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
      first_name: 'YOUR FIRST NAME',
      last_name: 'YOUR LAST NAME',
      email: 'admin@example.com',
      role: 'admin',
      password_digest: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: 'admin@example.com'
    })
  }
};
