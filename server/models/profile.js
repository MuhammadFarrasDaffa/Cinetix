'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, { foreignKey: 'UserId' });
    }
  }
  Profile.init({
    username: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    age: DataTypes.INTEGER,
    preferences: DataTypes.ARRAY(DataTypes.STRING),
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });

  Profile.beforeCreate((profile) => {
    profile.imageUrl = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80";
  });

  return Profile;
};