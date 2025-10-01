const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary/initialization");
const {
  createPost,
  getMyProfile,
  getAllPosts,
  getPostById,
  getProfile,
  karmaPoint,
  getLikes,
} = require("../controllers/postControllers");

const upload = multer({ storage });
const router = express.Router();

router.post("/post/:id", upload.single("file"), createPost);
router.get("/myprofile/:id", getMyProfile);
router.get("/post", getAllPosts);
router.get("/posts/:id", getPostById);
router.get("/profile/:id", getProfile);
router.post("/karmapoint", karmaPoint);
router.get("/getLikes", getLikes);

module.exports = router;
