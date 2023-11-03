const express = require("express");
const {
  fetchTransactions,
  fetchTransactionById,
} = require("../controller/transactions.controller");
const { authenticate } = require("../middleware/middleware");
const router = express.Router();

router.get("/transactions", [authenticate], fetchTransactions);
router.get("/transactions/:id", fetchTransactionById);

module.exports = router;
