const RoleSeed = require('../SeedData/RoleSeed');
const role = require('../models/role')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('role', RoleSeed, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
