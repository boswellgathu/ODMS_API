'use strict';
module.exports = (sequelize, DataTypes) => {
  const document = sequelize.define('document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: (models) => {
        document.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
          allowNull: false
        });
      },
    },
  });
  return document;
};
