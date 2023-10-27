const express = require("express");
const router = express.Router();
const users_routes = require("./users.routes");
const accounts_routes = require("./accounts.routes");
const transactions_routes = require("./transaction.routes");
const morgan = require("morgan");
router.use(morgan("dev"));

// version 1 :  api/v1
router.use("/v1", [users_routes, accounts_routes, transactions_routes]);

module.exports = router;
