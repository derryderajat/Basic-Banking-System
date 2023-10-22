const express = require("express");
const {
  fetchUsers,
  fetchUserById,
  insertOneUser,
} = require("../controller/users.controller");
const router = express.Router();

router.get("/", fetchUsers);
router.get("/:id", fetchUserById);
router.post("/", insertOneUser);

module.exports = router;
