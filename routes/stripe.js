const express = require("express");
const router = express.Router();
//middlwares
const { checkUser } = require("../middlewares/auth");
//controllers
const { createPaymentIntent } = require("../controller/stripe");

router.post("/createPayment", checkUser, createPaymentIntent);

module.exports = router;
