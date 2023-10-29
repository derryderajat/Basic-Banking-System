const express = require("express");
const router = express.Router();
const {
  fetchAccounts,
  fetchAccountsById,
  insertOneAccount,
  withdraw,
  deposit,
  balanceInquiry,
} = require("../controller/accounts.controller");
const {
  isAmountPositive,
  isBalanceSufficient,
  validateBankAccount,
} = require("../middleware/middleware");

router.get("/accounts", fetchAccounts);
router.get("/accounts/:accountId", fetchAccountsById);
router.post("/accounts", insertOneAccount);
// add withdraw and deposit
router.post(
  "/accounts/:bank_account_number/withdraw",
  [isAmountPositive, isBalanceSufficient],
  withdraw
);
router.post(
  "/accounts/:bank_account_number/deposit",
  [isAmountPositive],
  deposit
);

router.get(
  "/accounts/:bank_account_number/balance_inquiry",
  [validateBankAccount],
  balanceInquiry
);
module.exports = router;
