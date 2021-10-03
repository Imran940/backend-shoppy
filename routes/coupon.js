const express = require("express");
const router = express.Router();
//middlwares
const { checkUser, checkAdmin } = require("../middlewares/auth");
//controllers
const { create, remove, list } = require("../controller/coupon");

router.post("/coupon", checkUser, checkAdmin, create);
router.get("/coupons", list);
router.delete("/coupon/:couponName", checkUser, checkAdmin, remove);
module.exports = router;
