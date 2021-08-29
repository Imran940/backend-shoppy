const express = require("express");
const router = express.Router();
//middlwares
const { checkUser, checkAdmin } = require("../middlewares/auth");
//controllers
const {
  create,
  read,
  update,
  remove,
  list,
  getSubsCategory,
  getLimitedProducts,
} = require("../controller/product");

router.post("/product", checkUser, checkAdmin, create);
router.get("/products/", list);
router.get("/products/:count", getLimitedProducts);
router.get("/category/subs/:cid", getSubsCategory);
router.get("/product/:slug", read);
router.put("/product/:slug", checkUser, checkAdmin, update);
router.delete("/product/:slug", checkUser, checkAdmin, remove);
module.exports = router;
