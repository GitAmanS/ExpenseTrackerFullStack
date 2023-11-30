const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const IncomeModel = sequelize.define("incomes", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  IncomeAmount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  IncomeDescription: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  IncomeCategory: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  IncomeDate:{
    type: Sequelize.DATEONLY,
    allowNull:true,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = IncomeModel;
