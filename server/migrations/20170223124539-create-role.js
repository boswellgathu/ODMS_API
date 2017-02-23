'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'role',
          key: 'id',
          as: 'roleId',
        },
      },
    });
  },
  down: (queryInterface) => {
    queryInterface.dropTable('roles');
  }
};
