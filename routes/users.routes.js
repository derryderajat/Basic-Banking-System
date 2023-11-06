const express = require("express");
const {
  fetchUsers,
  fetchUserById,
  insertOneUser,
  updateUserById,
} = require("../controller/users.controller");
const {
  validateUserPost,
  isAuthenticate,
} = require("../middleware/middleware");
const router = express.Router();

router.get("/users", [isAuthenticate], fetchUsers);
router.get("/users/:id", [isAuthenticate], fetchUserById);
router.post("/users", [isAuthenticate, validateUserPost], insertOneUser);
router.put("/users/:id", [isAuthenticate], updateUserById);

module.exports = router;
