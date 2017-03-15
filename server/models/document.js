module.exports = (sequelize, DataTypes) => {
  const document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    access: {
      type: DataTypes.ENUM,
      values: ['public', 'private'],
      defaultValue: 'private'
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
