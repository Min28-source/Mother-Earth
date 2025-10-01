const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary/initialization");
const { signup, login } = require("../controllers/authControllers");

const upload = multer({ storage });
const router = express.Router();

router.post("/signup", upload.single("file"), signup);
router.post("/login", login);

module.exports = router;
