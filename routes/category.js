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
} = require("../controller/category");

router.post("/category", checkUser, checkAdmin, create);
router.get("/categories", list);
router.get("/category/:slug", checkUser, checkAdmin, read);
router.put("/category/:slug", checkUser, checkAdmin, update);
router.delete("/category/:slug", checkUser, checkAdmin, remove);
module.exports = router;
