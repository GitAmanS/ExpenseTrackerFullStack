const express = require("express");
const router = express.Router();
const IncomeController = require("../controllers/incomeController");

router.get("/getAllIncomes", IncomeController.getAllIncomes);

router.delete("/deleteIncome/:id", IncomeController.deleteIncome);

router.post("/addIncome", IncomeController.addIncome);

router.get("/getTotalIncomes", IncomeController.getTotalIncomes);

module.exports = router;
