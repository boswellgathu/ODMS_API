const DocSeed = require('../SeedData/DocSeed');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('document', DocSeed, {});
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
