import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box, Container, Typography, Avatar } from "@mui/material";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useToast } from "./Contexts/toastContext";

export default function Signup() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handlechange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const [file, setFile] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      const imageUrl = window.URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    } else {
      console.warn("No valid file selected");
    }
  };

  async function handlesubmit(e) {
    e.preventDefault();
    try {
      const response = await axios
        .post(
          `${import.meta.env.VITE_API_URL}/signup`,
          {
            file,
            data: formData,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
      console.log(response);
      const token = response.data.token;
      localStorage.setItem("token", token);
      showSuccess("Welcome to MotherEarth.");
      navigate("/");
    } catch (err) {
      console.log(err);
      showError(err);
    }
    setFormData({ username: "", email: "", password: "" });
  }

  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          marginTop: "7rem",
          borderRadius: 5,
          boxShadow: "3",
          p: 3,
          width: { xs: "80%", sm: "50%", md: "40%", lg: "35%", xl: "20%" },
        }}
      >
        <form onSubmit={handlesubmit}>
          <Typography variant="h4" align="center">
            Sign Up
          </Typography>
          <Typography variant="h6" align="center" style={{ color: "gray" }}>
            Welcome to Mother Earth
          </Typography>
          <hr />

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            mt={2}
            mb={2}
          >
            <Box
              component="label"
              sx={{
                cursor: "pointer",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Avatar src={previewUrl} sx={{ width: 100, height: 100 }} />
              <Typography sx={{ mt: 1 }} style={{ color: "gray" }}>
                + Add a profile picture
              </Typography>
              <input
                style={{
                  visibility: "hidden",
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                }}
                type="file"
                name="file"
                onChange={handleImageChange}
              />
            </Box>
          </Box>

          <TextField
            id="username"
            label="Username"
            name="username"
            value={formData.username}
            autoComplete="username"
            variant="outlined"
            onChange={handlechange}
            margin="normal"
            fullWidth
            required
          />
          <TextField
            type="password"
            id="password"
            label="Password"
            name="password"
            variant="outlined"
            onChange={handlechange}
            autoComplete="new-password"
            value={formData.password}
            margin="normal"
            fullWidth
            required
          />

          <TextField
            id="email"
            label="Email"
            variant="outlined"
            name="email"
            onChange={handlechange}
            value={formData.email}
            margin="normal"
            fullWidth
            required
          />
          <Box mt={3}>
            <Button variant="contained" size="large" type="submit" fullWidth>
              Submit
            </Button>
          </Box>
        </form>
        <Typography mt={2} align="center">
          Already have an account? Login <Link to={"/login"}>here</Link>
        </Typography>
      </Container>
    </>
  );
}
