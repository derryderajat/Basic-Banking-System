const express = require("express");
const router = express.Router();
const {
  fetchAccounts,
  fetchAccountsById,
  insertOneAccount,
} = require("../controller/accounts.controller");

router.get("/accounts", fetchAccounts);
router.get("/accounts/:accountId", fetchAccountsById);
router.post("/accounts", insertOneAccount);
module.exports = router;
