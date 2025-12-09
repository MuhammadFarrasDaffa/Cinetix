'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Seat.belongsTo(models.Studio, { foreignKey: 'StudioId' });
      Seat.belongsToMany(models.Schedule, { through: models.ScheduleSeat, foreignKey: 'SeatId' });
    }
  }
  Seat.init({
    StudioId: DataTypes.INTEGER,
    seatRow: DataTypes.STRING,
    seatNumber: DataTypes.INTEGER,
    seatCode: DataTypes.STRING,
    isAvailable: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Seat',
  });
  return Seat;
};