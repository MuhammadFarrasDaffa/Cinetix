'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Collection.belongsTo(models.User, { foreignKey: "UserId" })
      Collection.belongsTo(models.Movie, { foreignKey: "MovieId" })
    }
  }
  Collection.init({
    UserId: DataTypes.INTEGER,
    MovieId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Collection',
  });
  return Collection;
};