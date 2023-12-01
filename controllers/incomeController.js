const IncomeModel = require("../models/incomeModel");
const UserModel = require("../models/userModel");
const sequelize = require("../util/database");
//save data to database
const addIncome = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const IncomeAmount = req.body.incomeAmount;
    const IncomeDescription = req.body.incomeDescription;
    const incomeCategory = req.body.incomeCategory;
    const incomeDate = req.body.incomeDate;

  


    const data = await IncomeModel.create(
      {
        IncomeAmount: IncomeAmount,
        IncomeDescription: IncomeDescription,
        IncomeCategory: incomeCategory,
        UserId: req.user.id,
        IncomeDate: incomeDate,
      },
      { transaction: t }
    );

    const newTotalincome =
      parseInt(req.user.totalincome) + parseInt(IncomeAmount);

    await UserModel.update(
      {
        totalincome: newTotalincome,
      },
      {
        where: { id: req.user.id },
        transaction: t, // Pass the transaction object here
      }
    );

    await t.commit();
    res.status(201).json({ income: data });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({
      error: "Failed to create a new income",
      message: error.message,

    });
  }
};


//delete user
const deleteIncome = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const IncomeId = req.params.id; // Use IncomeId instead of userId
    console.log(IncomeId);
    if (!IncomeId) {
      return res.status(400).json({
        error: "Income ID missing",
      });
    }

    // Check if the Income exists for the given ID
    const Income = await IncomeModel.findOne({
      where: {
        id: IncomeId,
      },
      transaction: t,
    });

    if (!Income) {
      await t.rollback();
      return res.status(404).json({
        error: "Income not found",
      });
    }

    // Delete the Income
    const deleteResult = await IncomeModel.destroy({
      where: {
        id: IncomeId,
      },
      transaction: t,
    });

    // Update total Income of the user
    const newTotalIncome = req.user.totalIncome - Income.IncomeAmount;
    await req.user.update(
      { totalIncome: newTotalIncome },
      { transaction: t }
    );

    await t.commit();

    if (deleteResult === 1) {
      return res.status(200).json({
        success: "Income deleted successfully",
      });
    } else {
      return res.status(404).json({
        error: "Income not found",
      });
    }
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      error: "Error in deleting Income",
    });
  }
};

//fetch all Incomes
const getAllIncomes = async (req, res, next) => {
  try {
    const Incomes = await IncomeModel.findAll({
      where: { userId: req.user.id },
    });
    res.status(200).json(Incomes);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: err,
    });
  }
};

const getTotalIncomes = async(req, res, next)=>{
  try {
    const sumOfIncomes = await IncomeModel.sum('IncomeAmount', {
      where: { userId: req.user.id },
    });
    res.status(200).json(sumOfIncomes);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: err,
    });
  }
};

module.exports = { addIncome, deleteIncome, getAllIncomes, getTotalIncomes };
