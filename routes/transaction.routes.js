const express = require("express");
const {
  fetchTransactions,
  fetchTransactionById,
} = require("../controller/transactions.controller");
const { isAuthenticate } = require("../middleware/middleware");
const router = express.Router();

router.get("/transactions", [isAuthenticate], fetchTransactions);
router.get("/transactions/:id", [isAuthenticate], fetchTransactionById);

module.exports = router;
