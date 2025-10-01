const Conversations = require("../models/conversations");
const Messages = require("../models/messages");
const User = require("../models/Users");

exports.getConversations = async (req, res) => {
    const { senderId } = req.query;
    const found = await Conversations.find({ participants: senderId });

    const recievers = found.map(async (item) => {
        const recieverId = item.participants.find((id) => id !== senderId);
        const userData = await User.findById(recieverId);
        return {
            recieverId,
            username: userData.username,
            lastMessage: item.lastMessage,
            time: item.lastModified,
        };
    });

    const result = await Promise.all(recievers.flat());
    res.status(200).json(result);
};

exports.getConvoId = async (req, res) => {
    const { senderId, receiverId } = req.query;
    const conversation = await Conversations.find({
        participants: { $all: [senderId, receiverId] },
    });
    res.status(200).json(conversation[0]._id);
};

exports.getMessages = async (req, res) => {
    const { convoId } = req.query;
    const response = await Messages.find({ conversationId: convoId });

    const data = response.map((item) => ({
        text: item.text,
        senderId: item.senderId,
        time: item.time,
    }));

    res.status(200).json(data);
};
