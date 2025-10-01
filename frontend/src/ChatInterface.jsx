import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const socket = io(`${import.meta.env.VITE_API_URL}`);

export default function ChatInterface() {
  const [userData, setUserData] = useState(null);
  const [sentMessages, setSentMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [convoId, setConvoId] = useState("");
  const { senderId, receiverId } = useParams();
  const navigate = useNavigate()

  //gets the conversation id of the sender and the receiver
  useEffect(() => {
    async function getConvoId() {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/convoId`, {
        params: {
          senderId,
          receiverId
        }
      })
      setConvoId(response.data)
    }
    getConvoId()
  }, [])

  //uses the above recieved conversation id to fetch all the messages in chat in a particular convo
  useEffect(() => {
    if (!convoId) return
    async function getMessages() {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages`, {
        params: {
          convoId
        }
      })

      const messages = response.data.map((item) => {
        return {
          message: item.text,
          senderId: item.senderId
        };
      })
      setSentMessages(messages)
    }
    getMessages()
  }, [convoId])

  //we need a username to be displayed on the above chat
  useEffect(() => {
    async function getData() {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/profile/${receiverId}`
      );
      setUserData(response.data);
    }
    getData();
  }, []);

  useEffect(() => {
    if (!receiverId || !senderId) return;
    const participants = [senderId, receiverId].sort();
    const roomId = `${participants[0]}_${participants[1]}`;
    socket.emit("joinRoom", { roomId });

    socket.on("recievemessage", ({ message, senderId }) => {
      setSentMessages((prev) => [...prev, { message, senderId }]);
    });

    return () => {
      socket.off("recievemessage");
    };
  }, [senderId, receiverId, sentMessages]);

  function handlesend() {
    if (message.trim() === "") {
      return "";
    }
    const participants = [senderId, receiverId].sort();
    const roomId = `${participants[0]}_${participants[1]}`;
    socket.emit("sendmessage", { senderId, message, roomId, receiverId });
    setMessage("");
  }
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", marginTop: "65px" }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #ccc",
          }}
        >

          {userData &&
            <>
              <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIosIcon />
              </IconButton>
              <Avatar src={userData.url} />
              <Typography variant="h6" sx={{ ml: 2 }}>
                {userData.username}
              </Typography>
            </>
          }
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            marginBottom: "80px",
            height: "70vh",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {sentMessages.map((msg, index) => {
            const isYou = msg.senderId === senderId;

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: isYou ? "flex-end" : "flex-start",
                }}
              >
                {!isYou && (
                  <Avatar
                    sx={{ width: 30, height: 30, mr: 1, mt: "auto" }}
                    src={userData.url}
                  />
                )}

                <Box
                  sx={{
                    bgcolor: isYou ? "green" : "#f1f1f1",
                    color: isYou ? "#fff" : "#000",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "65%",
                  }}
                >
                  {msg.message}
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #ccc",
            display: "flex",
            position: "fixed",
            bottom: "0px",
            width: "95vw",
          }}
        >
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            placeholder="Type a message..."
          />
          <Button onClick={handlesend} variant="contained" sx={{ ml: 1, backgroundColor: "green" }}>
            Send
          </Button>
        </Box>
      </Box>
    </>
  );
}