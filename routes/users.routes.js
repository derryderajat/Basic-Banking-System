const express = require("express");
const {
  fetchUsers,
  fetchUserById,
  insertOneUser,
  updateUserById,
} = require("../controller/users.controller");
const { validateUserPost } = require("../middleware/middleware");
const router = express.Router();

router.get("/users", fetchUsers);
router.get("/users/:id", fetchUserById);
router.post("/users", validateUserPost, insertOneUser);
router.put("/users/:id", updateUserById);

module.exports = router;
