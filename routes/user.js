const express = require("express");
const { userDeom } = require("../controller/user");

const router = express.Router();

router.get("/user", userDeom);

module.exports = router;
