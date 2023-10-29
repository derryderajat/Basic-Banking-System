const express = require("express");
const {
  fetchTransactions,
  fetchTransactionById,
} = require("../controller/transactions.controller");

const router = express.Router();

router.get("/transactions", fetchTransactions);
router.get("/transactions/:id", fetchTransactionById);

module.exports = router;
