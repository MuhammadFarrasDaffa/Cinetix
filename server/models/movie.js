'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.hasOne(models.Watchlist, { foreignKey: 'MovieId' });
      Movie.hasOne(models.Payment, { foreignKey: 'MovieId' });
      Movie.hasOne(models.Collection, { foreignKey: 'MovieId' });
    }
  }
  Movie.init({
    tmdbId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    rating: DataTypes.DECIMAL(2, 1),
    imageUrl: DataTypes.STRING,
    status: DataTypes.STRING,
    genres: DataTypes.ARRAY(DataTypes.STRING),
    duration: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    releaseDate: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};