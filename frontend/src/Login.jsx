import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box, Container, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "./Contexts/toastContext";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  
  function handlechange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handlesubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        formData
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      showSuccess(response.data.message);
      navigate("/");
    } catch (e) {
      showError("The username or password is incorrect.");
      console.log(e);
    }
    setFormData({ username: "", password: "" });
  }

  return (
    <Container
      sx={{
        marginTop: "7rem",
        borderRadius: 5,
        boxShadow: "3",
        p: 3,
        width: { xs: "80%", sm: "50%", md: "40%", lg: "35%", xl: "20%" },
      }}
    >
      <form onSubmit={handlesubmit}>
        <Typography variant="h5" align="center">
          Login
        </Typography>
        <TextField
          id="username"
          label="Username"
          name="username"
          value={formData.username}
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
          value={formData.password}
          variant="outlined"
          onChange={handlechange}
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
        Already have an account? Sign in <Link to={"/signup"}>here</Link>
      </Typography>
    </Container>
  );
}
