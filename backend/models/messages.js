const mongoose = require('mongoose')
const { Schema } = mongoose;

const messageSchema = new Schema({
    conversationId: [{ type: Schema.Types.ObjectId, ref: 'conversations', required: 'true' }],
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    time: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Messages", messageSchema);