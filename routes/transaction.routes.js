const express = require("express");
const {
  createTransaction,
  fetchTransactions,
  fetchTransactionById,
} = require("../controller/transactions.controller");
const {
  isAmountPositive,
  validateBankAccount,
} = require("../middleware/middleware");

const router = express.Router();

router.get("/transactions", fetchTransactions);
router.get("/transactions/:id", fetchTransactionById);
router.post(
  "/transactions",
  [isAmountPositive, validateBankAccount],
  createTransaction
);

module.exports = router;
