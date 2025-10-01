const express = require("express");
const {
  getConversations,
  getConvoId,
  getMessages,
} = require("../controllers/conversationControllers");

const router = express.Router();

router.get("/getConvo", getConversations);
router.get("/convoId", getConvoId);
router.get("/messages", getMessages);

module.exports = router;
