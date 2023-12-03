const ExpenseModel = require("../models/expenseModel");
const UserModel = require("../models/userModel");
const sequelize = require("../util/database");
//save data to database
const addExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const ExpenseAmount = req.body.ExpenseAmount;
    const ExpenseDescription = req.body.ExpenseDescription;
    const ExpenseCategory = req.body.ExpenseCategory;
    const ExpenseDate = req.body.ExpenseDate;

  


    const data = await ExpenseModel.create(
      {
        ExpenseAmount: ExpenseAmount,
        ExpenseDescription: ExpenseDescription,
        ExpenseCategory: ExpenseCategory,
        UserId: req.user.id,
        ExpenseDate: ExpenseDate,
      },
      { transaction: t }
    );

    const newTotalExpense =
      parseInt(req.user.totalExpense) + parseInt(ExpenseAmount);

    await UserModel.update(
      {
        totalExpense: newTotalExpense,
      },
      {
        where: { id: req.user.id },
        transaction: t, // Pass the transaction object here
      }
    );

    await t.commit();
    res.status(201).json({ Expense: data });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({
      error: "Failed to create a new Expense",
      message: error.message,

    });
  }
};


//delete user
const deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const ExpenseId = req.params.id; // Use ExpenseId instead of userId
    console.log(ExpenseId);
    if (!ExpenseId) {
      return res.status(400).json({
        error: "Expense ID missing",
      });
    }

    // Check if the Expense exists for the given ID
    const Expense = await ExpenseModel.findOne({
      where: {
        id: ExpenseId,
      },
      transaction: t,
    });

    if (!Expense) {
      await t.rollback();
      return res.status(404).json({
        error: "Expense not found",
      });
    }

    // Delete the Expense
    const deleteResult = await ExpenseModel.destroy({
      where: {
        id: ExpenseId,
      },
      transaction: t,
    });

    // Update total Expense of the user
    const newTotalExpense = req.user.totalExpense - Expense.ExpenseAmount;
    await req.user.update(
      { totalExpense: newTotalExpense },
      { transaction: t }
    );

    await t.commit();

    if (deleteResult === 1) {
      return res.status(200).json({
        success: "Expense deleted successfully",
      });
    } else {
      return res.status(404).json({
        error: "Expense not found",
      });
    }
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      error: "Error in deleting Expense",
    });
  }
};

//fetch all Expenses
const getAllExpenses = async (req, res, next) => {
  try {
    const Expenses = await ExpenseModel.findAll({
      where: { userId: req.user.id },
    });
    res.status(200).json(Expenses);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: err, userId: req.user.id,
    });
  }
};

const getTotalExpenses = async (req, res, next) => {
  try {
    // Find the user by primary key (id)
    const user = await UserModel.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Access the totalExpense directly from the UserModel
    const totalExpense = user.totalExpense;

    res.status(200).json({ totalExpense });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
};

module.exports = { addExpense, deleteExpense, getAllExpenses, getTotalExpenses };
