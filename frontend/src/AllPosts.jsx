import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { useToast } from "./Contexts/toastContext";

export default function AllPosts() {
  const { showError } = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState("");
  const [likedPosts, setLikedPosts] = useState(new Set());

  // Navigate to single project page
  async function handleclick(id) {
    navigate(`/posts/${id}`);
  }

  // Fetch all posts
  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/post`);
        setData(response.data);
      };
      fetchPosts();
      console.log(data)
    } catch (e) {
      console.log(e)
    }
  }, []);

  // Get logged in user id
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decode = jwtDecode(token);
    setUserId(decode.id);
  }, []);

  // Fetch liked posts for this user
  useEffect(() => {
    if (!userId) return;
    async function getLikes() {
      const likes = await axios.get(`${import.meta.env.VITE_API_URL}/getLikes`, {
        params: { userId },
      });
      setLikedPosts(new Set(likes.data));
    }
    getLikes();
  }, [userId]);

  async function addPoint(id, isLiked) {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/karmapoint`, {
        userId: userId,
        postId: id,
        contains: isLiked,
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 6 }}>
      {/* Section Heading */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Featured Projects
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover amazing environmental initiatives you can support
        </Typography>
      </Box>

      {/* Projects Grid */}
      <Grid
        container spacing={4}
        sx={{
          borderTop: 'var(--Grid-borderWidth) solid',
          borderLeft: 'var(--Grid-borderWidth) solid',
          borderColor: 'divider',
          '& > div': {
            borderRight: 'var(--Grid-borderWidth) solid',
            borderBottom: 'var(--Grid-borderWidth) solid',
            borderColor: 'divider',
          },
        }}
      >
        {data.length > 0 ? (
          data.map((item) => (
            <Grid
              key={item._id}
              size={{
                xs: 12,
                sm: 12,
                md: 6,
                lg: 6,
              }}
            >
              <Card
                sx={{
                  cursor: "pointer",
                  borderRadius: 3,
                  boxShadow: 3,
                  overflow: "hidden",
                  position: "relative",
                  transition: "0.3s",
                  height: "100%",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
                onClick={() => handleclick(item._id)}
              >
                {/* Like / Karma Button */}
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: "rgba(255, 255, 255, 0.7)",
                    "&:hover": { background: "rgba(255, 255, 255, 0.9)" },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!userId) {
                      showError("You need to be logged in first.");
                      return;
                    }
                    const isLiked = likedPosts.has(item._id);
                    addPoint(item._id, isLiked);

                    setLikedPosts((prevSet) => {
                      const newSet = new Set(prevSet);
                      if (isLiked) newSet.delete(item._id);
                      else newSet.add(item._id);
                      return newSet;
                    });
                  }}
                >
                  {likedPosts.has(item._id) ? (
                    <FontAwesomeIcon
                      icon={faLeaf}
                      style={{ color: "#6aff4d" }}
                    />
                  ) : (
                    <FontAwesomeIcon icon={faLeaf} />
                  )}
                </IconButton>

                {/* Image */}
                <CardMedia
                  component="img"
                  height="200"
                  image={item.url}
                  alt={item.title}
                  sx={{
                    objectFit: "cover",
                  }}
                />

                {/* Content */}
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      transition: "color 0.3s",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {item.description?.slice(0, 100)}...
                  </Typography>

                  {/* Location + Karma */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mt: 2 }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationOnIcon color="action" fontSize="small" />
                      <Typography variant="body2">{item.location}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {likedPosts.has(item._id) ? "Karma earned!" : ""}
                    </Typography>
                  </Stack>

                  {/* Amount */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mt: 2, pt: 2, borderTop: "1px solid #eee" }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      ₹{item.amount?.toLocaleString() || 0}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h5" sx={{ mt: 10 }}>
            No Projects yet
          </Typography>
        )}
      </Grid>
    </Container>
  );
}
