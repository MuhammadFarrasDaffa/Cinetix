'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: 'UserId' });
      Booking.belongsTo(models.Schedule, { foreignKey: 'ScheduleId' });
      Booking.hasOne(models.Payment, { foreignKey: 'BookingId' });
    }
  }
  Booking.init({
    UserId: DataTypes.INTEGER,
    ScheduleId: DataTypes.INTEGER,
    bookingDate: DataTypes.DATE,
    totalSeat: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};