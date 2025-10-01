const dotenv = require("dotenv")
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

// models
const Conversations = require("./models/conversations");
const Messages = require("./models/messages");

// app setup
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// db
mongoose.connect(process.env.MONGO_URI).then(() => console.log("Cloud Database Connected"))
  .catch(err => console.error(err));

// routes
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/postRoutes"));
app.use("/", require("./routes/conversationRoutes"));
app.use("/", require("./routes/paymentRoutes"));

// socket setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    socket.on("joinRoom", ({ roomId }) => {
        socket.join(roomId);
    });

    socket.on("sendmessage", async ({ senderId, message, roomId, receiverId }) => {
        let conversation = await Conversations.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
            conversation = await Conversations.create({
                participants: [senderId, receiverId],
            });
        }
        Messages.create({
            conversationId: conversation._id,
            senderId,
            text: message,
        });

        await Conversations.updateOne(
            { _id: conversation._id },
            {
                $set: { lastMessage: message },
                $currentDate: { lastModified: true },
            }
        );
        io.to(roomId).emit("recievemessage", { message, senderId });
    });
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
