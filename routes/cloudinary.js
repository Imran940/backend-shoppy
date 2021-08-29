const express = require("express");
const router = express.Router();
//middlwares
const { checkUser, checkAdmin } = require("../middlewares/auth");

const { upload, remove } = require("../controller/cloudinary");
router.post("/uploadimages", checkUser, checkAdmin, upload);
router.post("/removeimages", checkUser, checkAdmin, remove);

module.exports = router;
