import UserSeed from '../SeedData/UserSeed';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('User', UserSeed, {});
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
