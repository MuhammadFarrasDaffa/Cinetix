'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Movie, { foreignKey: 'MovieId' });
      Schedule.belongsTo(models.Studio, { foreignKey: 'StudioId' });
      Schedule.belongsToMany(models.Seat, { through: models.ScheduleSeat, foreignKey: 'ScheduleId' });
    }
  }
  Schedule.init({
    MovieId: DataTypes.INTEGER,
    StudioId: DataTypes.INTEGER,
    showDate: DataTypes.DATE,
    showTime: DataTypes.TIME,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};