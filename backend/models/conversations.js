const mongoose = require('mongoose')
const { Schema } = mongoose;

const conversationSchema = new Schema({
    participants : [String],
    lastMessage: String,
    lastModified : Date
})

module.exports = mongoose.model("Conversations", conversationSchema);