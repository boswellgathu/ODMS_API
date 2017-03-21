const Bcrypt = require('bcrypt-nodejs');
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
            args: 6,
            msg: "password must have six or more characters"
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
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
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
      classMethods: {
        associate: (models) => {
          User.hasMany(models.Document, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
          });
        }
      },
      instanceMethods: {
        Authenticate(password) {
          return Bcrypt.compareSync(password, this.password);
        }
      }
    })
  User.beforeCreate((user, options) => {
    if (user.password !== user.password_confirmation) {
      throw new Error('Password and Password_confirmation do not match!')
    }
  })
  User.beforeCreate((user, options) => {
    const HashedPassword = Bcrypt.hashSync(user.password, Bcrypt.genSaltSync(10), null)
    user.password = HashedPassword;
  })
  User.beforeUpdate((user, options) => {
    if (user.password) {
      const HashedPassword = Bcrypt.hashSync(user.password, Bcrypt.genSaltSync(10), null)
      user.password = HashedPassword;
    }
  })
  return User;
};
