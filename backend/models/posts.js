const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    amount: { type: Number, required: true },
    location: { type: String, required: true },
    karmaPoints: { type: Number, default: 0 },
    postedBy: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
});

module.exports = mongoose.model("Posts", userSchema)