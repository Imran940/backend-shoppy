const express = require("express");
const router = express.Router();

const { checkUser } = require("../middlewares/auth");
const {
  saveCartInfo,
  getCartInfo,
  emptyCartInfo,
  saveAddress,
  applyCoupon,
  createOrder,
  fetchAllUserOrders,
} = require("../controller/user");
router.post("/user/cart", checkUser, saveCartInfo);
router.post("/user/order", checkUser, createOrder);
router.post("/user/coupon", checkUser, applyCoupon);
router.post("/user/address", checkUser, saveAddress);
router.get("/user/cart", checkUser, getCartInfo);
router.get("/user/order", checkUser, fetchAllUserOrders);
router.delete("/user/cart", checkUser, emptyCartInfo);

//coupon


//order

module.exports = router;
