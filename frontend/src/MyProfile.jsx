import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Divider,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function MyProfile() {
  const [data, setData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/myprofile/${decoded.id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setData(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }
    fetchData();
  }, []);
  
  console.log(data)
  const handleAvatarClick = () => setDialogOpen(true);
  const handleClose = () => setDialogOpen(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        p: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
        marginTop: "65px",
      }}
    >
      {data ? (
        <Box sx={{ width: "100%", maxWidth: 900 }}>
          {/* Profile Card */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              mb: 4,
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Avatar
              src={data.url}
              alt={data.username}
              onClick={handleAvatarClick}
              sx={{
                width: 100,
                height: 100,
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
            <Box textAlign={{ xs: "center", sm: "left" }}>
              <Typography variant="h5" fontWeight="bold">
                {data.username}
              </Typography>
              <Typography color="text.secondary">{data.email}</Typography>
            </Box>
          </Paper>

          {/* Liked Posts */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Liked Posts
          </Typography>

          {data.likedPosts?.length > 0 ? (
            <Grid container spacing={3}>
              {data.likedPosts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post._id}>
                  <Card
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {post.title}
                      </Typography>
                      <Divider sx={{ mb: 1 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {post.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">No liked posts yet.</Typography>
          )}

          {/* Avatar Fullscreen Dialog */}
          <Dialog open={dialogOpen} onClose={handleClose}>
            <DialogContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                p: 3,
              }}
            >
              <IconButton
                onClick={handleClose}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>
              <Avatar
                src={data.url}
                alt={data.username}
                sx={{
                  width: 200,
                  height: 200,
                  border: "4px solid #1976d2",
                }}
              />
              
            </DialogContent>
          </Dialog>
        </Box>
      ) : (
        <Typography>Loading your profile...</Typography>
      )}
    </Box>
  );
}