const express = require("express");
const router = express.Router();
const ExpenseController = require("../controllers/expenseController");

router.get("/getAllExpenses", ExpenseController.getAllExpenses);

router.delete("/deleteExpense/:id", ExpenseController.deleteExpense);

router.post("/addExpense", ExpenseController.addExpense);

router.get("/getTotalExpenses", ExpenseController.getTotalExpenses);

module.exports = router;
