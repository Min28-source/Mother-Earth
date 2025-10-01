import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { jwtDecode } from "jwt-decode";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [senderId, setSender] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/profile/${userId}`
        );
        setData(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }
    getData();
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setSender(decoded.id);
    }
  }, []);

  function message() {
    navigate(`/chat/${senderId}/${userId}`);
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Card
        sx={{
          width: "100%",
          p: 3,
          boxShadow: 3,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar
            src={data.url}
            alt={data.username}
            sx={{ width: 100, height: 100 }}
          />
        </Box>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {data.username || "Loading..."}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {data.email}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, borderRadius: 2, px: 4 }}
            onClick={message}
          >
            Message User
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
