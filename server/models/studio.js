'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Studio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Studio.hasMany(models.Schedule, { foreignKey: 'StudioId' });
      Studio.hasMany(models.Seat, { foreignKey: 'StudioId' });
    }
  }
  Studio.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Studio',
  });
  return Studio;
};