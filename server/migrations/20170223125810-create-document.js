'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      access: {
        type: Sequelize.ENUM,
        values: ['public', 'private'],
        defaultValue: 'private'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId',
        },
      },
    });
  },
  down: (queryInterface) => {
    queryInterface.dropTable('documents');
  }
};
