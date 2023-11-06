const express = require("express");
const { register, login } = require("../../controller/auth/auth.controllers");
const authenticate = require("../../controller/auth/authenticate.controller");
const { isAuthenticate } = require("../../middleware/middleware");
const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

router.get("/auth/authenticate", [isAuthenticate], authenticate);
module.exports = router;
