const express = require("express");

const router = express.Router();
//middlwares
const { checkUser, checkAdmin } = require("../middlewares/auth");
//controllers
const { getAllOrders, orderStatus } = require("../controller/admin");

router.get("/admin/orders", checkUser, checkAdmin, getAllOrders);
router.put("/admin/order-status", checkUser, checkAdmin, orderStatus);

module.exports = router;
