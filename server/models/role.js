module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: (models) => {
        role.hasMany(models.User, {
          foreignKey: 'roleId'
        });
      }
    }
  });
  return role;
};
