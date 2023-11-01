const accountsPath = require("./accounts.swagger.path");
const transactionsPath = require("./transactions.swagger.path");
const usersPath = require("./users.swagger.path");

const swaggerPaths = { ...usersPath, ...transactionsPath, ...accountsPath };
module.exports = swaggerPaths;
