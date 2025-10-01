import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  IconButton,
  Grid,
  Stack,
  Box,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { useToast } from "./Contexts/toastContext";

export default function Project() {
  const [data, setData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [points, setPoints] = useState(null);
  const { projectId } = useParams();
  const { showError } = useToast();

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${projectId}`);
        setData(response.data);
        setPoints(response.data.karmaPoints);
      } catch (e) {
        console.log(e);
      }
    }
    getData();
  }, [projectId]);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decode = jwtDecode(token);
        setUserId(decode.id);
      }
    } catch (err) {
      console.log("Invalid token", err);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    async function getLikes() {
      const likes = await axios.get(`http://localhost:8080/getlikes`, { params: { userId } });
      setLikedPosts(new Set(likes.data));
    }
    getLikes();
  }, [userId]);

  async function addPoint(id, isLiked) {
    try {
      await axios.post(`http://localhost:8080/karmapoint`, { userId, postId: id, contains: isLiked });
    } catch (err) {
      console.log(err);
    }
  }

  async function handlePayment() {
    if (!userId) {
      showError("You need to be logged in first!");
      return;
    }

    try {
      const payAmount = data.amount;
      const response = await axios.post("http://localhost:8080/create-order", { amount: payAmount });
      const order = response.data;

      const options = {
        key: "rzp_test_RNIYzLqFP0GYlY",
        amount: order.amount,
        currency: order.currency,
        name: "Mother Earth",
        description: "Contribution to project",
        order_id: order.id,
        prefill: { name: data.name, email: data.email, contact: "9999999999" },
        theme: { color: "#4caf50" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Check console.");
    }
  }

  if (!data) return <Typography variant="h6" align="center" sx={{ mt: 10 }}>Loading...</Typography>;

  return (
    <Grid container spacing={4} sx={{ mt: 12, mb: 4, px: { xs: 2, md: 6 } }}>
      {/* LEFT SIDE */}
      <Grid item xs={12} md={8}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {data.title}
        </Typography>

        <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
          <CardMedia
            component="img"
            height="400"
            image={data.url}
            alt={data.title}
            sx={{ objectFit: "cover" }}
          />
        </Card>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {data.description}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <LocationOnIcon color="error" />
          <Typography variant="body1">{data.location}</Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              if (!userId) return showError("You need to be logged in first.");
              const isLiked = likedPosts.has(projectId);
              addPoint(projectId, isLiked);

              setLikedPosts(prev => {
                const newSet = new Set(prev);
                if (isLiked) newSet.delete(projectId);
                else newSet.add(projectId);
                return newSet;
              });

              setPoints(prev => prev + (isLiked ? -1 : 1));
            }}

            sx={{p: 0}}
          >
            {likedPosts.has(projectId) ? <FontAwesomeIcon icon={faLeaf} style={{ color: "#6aff4d" }} /> : <FontAwesomeIcon icon={faLeaf} />}
          </IconButton>
          <Typography>{points} karmas</Typography>
        </Stack>

        {userId !== data.postedBy[0]._id && (
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Posted by: <strong><Link to={`/profile/${data.postedBy[0]._id}`}>{data.postedBy[0].username}</Link></strong>
          </Typography>
        )}
      </Grid>


      <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          ₹{data.amount.toLocaleString()}
        </Typography>

        {userId !== data.postedBy[0]._id && (
          <Button
            variant="contained"
            size="large"
            color="success"
            onClick={handlePayment}
            sx={{ py: 1.5, fontWeight: "bold", textTransform: "none" }}
          >
            Pay Now
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
