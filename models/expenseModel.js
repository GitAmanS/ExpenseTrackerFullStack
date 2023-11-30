const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ExpenseModel = sequelize.define("expenses", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  ExpenseAmount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  ExpenseDescription: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  ExpenseCategory: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ExpenseDate:{
    type: Sequelize.DATEONLY,
    allowNull:true,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = ExpenseModel;
