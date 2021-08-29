const express = require("express");

const router = express.Router();
//middlwares
const { checkUser, checkAdmin } = require("../middlewares/auth");
//controllers
const { creatOrUpdateUser, currentUser } = require("../controller/auth");

router.post("/create-or-update-user", checkUser, creatOrUpdateUser);
router.post("/currentUser", checkUser, currentUser);
router.post("/currentAdmin", checkUser, checkAdmin, currentUser);

module.exports = router;
