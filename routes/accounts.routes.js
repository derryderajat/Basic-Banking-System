const express = require("express");
const router = express.Router();
const {
  fetchAccounts,
  fetchAccountsById,
  insertOneAccount,
  withdraw,
  deposit,
  balanceInquiry,
  history_transaction,
  transfer,
} = require("../controller/accounts.controller");
const {
  isAmountPositive,
  isBalanceSufficient,
  validateBankAccount,

  isAuthenticate,
} = require("../middleware/middleware");

router.get("/accounts", [isAuthenticate], fetchAccounts); // Admin only
router.get("/accounts/:accountId", [isAuthenticate], fetchAccountsById); // admin and owner
router.post("/accounts", [isAuthenticate], insertOneAccount); // admin only

// Withdraw route
router.post(
  "/accounts/:bank_account_number/withdraw",
  [validateBankAccount, isAmountPositive, isBalanceSufficient, isAuthenticate],
  withdraw
);
// Deposit Route
router.post(
  "/accounts/:bank_account_number/deposit",
  [isAmountPositive, isAuthenticate],
  deposit
);
// Get Balance Inquiry Information
router.get(
  "/accounts/:bank_account_number/balance_inquiry",
  [validateBankAccount, isAuthenticate],
  balanceInquiry
);

// get history transaction by bank account number
router.get(
  "/accounts/:bank_account_number/transactions",
  [validateBankAccount, isAuthenticate],
  history_transaction
);

router.post(
  "/accounts/:bank_account_number/transactions/:destination_account_number",
  [validateBankAccount, isAuthenticate, isAmountPositive, isBalanceSufficient],
  transfer
);
module.exports = router;
