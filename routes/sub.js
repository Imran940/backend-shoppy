const express = require("express");
const router = express.Router();
//middlwares
const { checkUser, checkAdmin } = require("../middlewares/auth");
//controllers
const { create, read, update, remove, list } = require("../controller/sub");

router.post("/sub", checkUser, checkAdmin, create);
router.get("/subs", list);
router.get("/sub/:slug", checkUser, checkAdmin, read);
router.put("/sub/:slug", checkUser, checkAdmin, update);
router.delete("/sub/:slug", checkUser, checkAdmin, remove);
module.exports = router;
