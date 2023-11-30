const userModel = require("../models/userModel");
const expenseModel = require("../models/incomeModel");
const sequelize = require("sequelize");
const getUserLeaderBoard = async (req, res) => {
  try {
    const userLeaderboardDetails = await userModel.findAll({
      attributes: ["name", "totalExpense"],
      order: [[sequelize.literal("totalExpense"), "DESC"]],
    });

    res.status(200).json({ userLeaderboardDetails });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

module.exports = { getUserLeaderBoard };
