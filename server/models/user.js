'use strict';
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [6, 128],
          msg: "Email address must be between 6 and 128 characters in length"
        },
        isEmail: {
          msg: "Email address must be valid"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: 3
        }
      }
    },
    password_confirmation: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: {
          args: 3
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    validate: {
      PasswordCheck: () => {
        if (User.password !== User.password_confirmation) {
          throw new Error('Both password and password_confirmation should be equal')
        }
      }
    },
    classMethods: {
      associate: (models) => {
        User.hasMany(models.document, {
          foreignKey: 'userId',
          onDelete: 'CASCADE'
        });
      },
      GenerateHashPassword: (password) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
      },
    },
    instanceMethods: {
      authenticate: (password) => {
        return bcrypt.compareSync(password, this.password);
      }
    }
  })
  User.beforeCreate((user, options) => {
    const HashedPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
    user.password = HashedPassword;
  })
  User.beforeUpdate((user, options) => {
    if (user.password) {
      const HashedPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
      user.password = HashedPassword;
    }
  })
  return User;
};
