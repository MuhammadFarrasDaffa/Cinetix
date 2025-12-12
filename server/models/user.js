'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey: 'UserId' });
      User.hasMany(models.Collection, { foreignKey: "UserId" })
      User.hasMany(models.Watchlist, { foreignKey: 'UserId' });
      User.hasMany(models.Payment, { foreignKey: 'UserId' });
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email has already used. Choose another email",
      },
      validate: {
        notNull: {
          args: true,
          msg: "Email is required!",
        },
        notEmpty: {
          args: true,
          msg: "Email is required!",
        },
        isEmail: {
          args: true,
          msg: "Invalid email format!",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Password is required!",
        },
        notEmpty: {
          args: true,
          msg: "Password is required!",
        },
        check(value) {
          if (value.length < 8) {
            throw new Error("Password character min 8!");
          }
        },
      },
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user) => {
    user.password = hashPassword(user.password);
  });

  return User;
};