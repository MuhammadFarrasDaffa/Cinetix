'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.User, { foreignKey: 'UserId' });
      Payment.belongsTo(models.Movie, { foreignKey: 'MovieId' });
    }
  }
  Payment.init({
    OrderId: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    MovieId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    status: DataTypes.STRING,
    transactionDetails: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};