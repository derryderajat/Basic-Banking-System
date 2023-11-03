const express = require("express");
const users_routes = require("./users.routes");
const accounts_routes = require("./accounts.routes");
const transactions_routes = require("./transaction.routes");
const register_route_v1 = require("./auth/auth.routes");

const morgan = require("morgan");
// version 1 :  api/v1
const v1 = express.Router();
v1.use(morgan("dev"));
v1.use("/", [
  users_routes,
  accounts_routes,
  transactions_routes,
  register_route_v1,
]);

// version 2 :  api/v2
const v2 = express.Router();
v2.use(morgan("dev"));
v2.use("/", [users_routes, accounts_routes, transactions_routes]);

const router = express.Router();
router.use("/v1", v1);
router.use("/v2", v2);
router.use("/", v2);

module.exports = router;
