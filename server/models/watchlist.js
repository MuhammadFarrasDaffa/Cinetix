'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Watchlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Watchlist.belongsTo(models.User, { foreignKey: 'UserId' });
      Watchlist.belongsTo(models.Movie, { foreignKey: 'MovieId' });
    }
  }
  Watchlist.init({
    UserId: DataTypes.INTEGER,
    MovieId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Watchlist',
  });
  return Watchlist;
};