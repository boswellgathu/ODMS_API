'use strict';
module.exports = function(sequelize, DataTypes) {
  var role = sequelize.define('role', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return role;
};