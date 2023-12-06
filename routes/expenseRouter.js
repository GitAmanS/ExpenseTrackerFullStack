const express = require("express");
const router = express.Router();
const ExpenseController = require("../controllers/expenseController");

router.get("/getAllExpenses", ExpenseController.getAllExpenses);

router.delete("/deleteExpense/:id", ExpenseController.deleteExpense);

router.post("/addExpense", ExpenseController.addExpense);

router.get("/getTotalExpenses", ExpenseController.getTotalExpenses);

router.get("/download", ExpenseController.expenseDownload);

router.get("/getAllLinks", ExpenseController.getAllLinks);

module.exports = router;
