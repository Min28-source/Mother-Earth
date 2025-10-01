import {
  Avatar,
  Box,
  Divider,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function ChatListPage() {
  const navigate = useNavigate();
  const [senderId, setSenderId] = useState(null);
  const [convo, setConvo] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decode = jwtDecode(token);
    setSenderId(decode.id);
  }, []);

  useEffect(() => {
    if (!senderId) return;

    async function getConvo() {
      try {
        const conversations = await axios.get(`${import.meta.env.VITE_API_URL}/getConvo`, {
          params: { senderId },
        });
        setConvo(conversations.data);
      } catch (err) {
        console.error(err);
      }
    }

    getConvo();
  }, [senderId]);

  // Filtered conversations based on search input
  const filteredConvo = convo.filter(chat =>
    chat.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        bgcolor: "background.default",
        mt: "65px",
        pb: 4,
      }}
    >
      <Typography variant="h5" sx={{ p: 2, fontWeight: "bold" }}>
        My conversations
      </Typography>

      {/* Search Bar */}
      <Paper
        sx={{
          m: 2,
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          borderRadius: 4,
        }}
      >
        <SearchIcon color="action" />
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          inputProps={{ "aria-label": "search by username" }}
        />
      </Paper>

      <List disablePadding>
        {filteredConvo.length > 0 ? (
          filteredConvo.map((chat) => (
            <Box key={chat.id}>
              <ListItem
                button
                onClick={() => navigate(`/chat/${senderId}/${chat.recieverId}`)}
                sx={{ px: 2, py: 1.5 }}
              >
                <ListItemAvatar>
                  <Avatar src={chat.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight="bold">{chat.username}</Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {dayjs(chat.time).fromNow()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {chat.lastMessage}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </Box>
          ))
        ) : (
          <Typography variant="h6" sx={{ mt: 4, textAlign: "center" }}>
            No conversations found
          </Typography>
        )}
      </List>
    </Box>
  );
}
