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
  getProductsCount,
  updateRating,
  listRelated,
  getProductsByCid,
  searchAndFilterProducts,
} = require("../controller/product");

router.post("/product", checkUser, checkAdmin, create);
router.get("/product/total", getProductsCount);
router.post("/products/", list); // for pagination
router.get("/products/:count", getLimitedProducts);
router.get("/category/subs/:cid", getSubsCategory);
router.get("/product/:slug", read);
router.put("/product/:slug", checkUser, checkAdmin, update);
router.delete("/product/:slug", checkUser, checkAdmin, remove);

router.put("/product/star/:productId", checkUser, updateRating);
router.get("/product/related/:productId", listRelated);

//SEARCH AND FILTER
router.post("/product/filter", searchAndFilterProducts);
module.exports = router;
