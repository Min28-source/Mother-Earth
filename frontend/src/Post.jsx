import {
  Container,
  Box,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
  InputAdornment,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useToast } from "./Contexts/toastContext";

export default function PostForm() {
  // Hidden input for file upload
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [file, setFile] = useState({});

  function handlechange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handlesubmit(e) {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);

      await axios
        .post(
          `${import.meta.env.VITE_API_URL}/post/${decoded.id}`,
          {
            data: formData,
            file,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(() => showSuccess("Your project was posted."))
        .then(() => navigate("/"));
    } catch (e) {
      console.log(e);
    }

    function validate() {
      const tempErrors = {};
      if (!formData.title) {
        tempErrors.title = "Title is required"
      }

      if (!formData.amount) {
        tempErrors.amount = "Amount is required"
      } else if (Number(tempErrors.amount) <= 0) {
        tempErrors.amount = "Please enter a valid amount"
      }

      if (!formData.description) {
        tempErrors.description = "Description is required"
      }

      if (!formData.location) {
        tempErrors.location = "Location is required"
      }
      if (!file || !file.name) {
        tempErrors.file = "Project image is required";
      }

      setErrors(tempErrors)
      return Object.keys(tempErrors).length === 0;
    }

    setFormData({
      title: "",
      description: "",
      amount: "",
      location: "",
    });
    setFile({});
  }

  return (
    <>
      <Container
        sx={{
          my: 12,
          width: { xs: "93%", sm: "80%", md: "60%", lg: "50%" },
        }}
      >
        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "100%" } }}
          noValidate
          autoComplete="off"
          onSubmit={handlesubmit}
        >
          <Typography align="center" variant="h6">
            Please tell us how you're contributing to the planet
          </Typography>

          <TextField
            error={!!errors.title}
            helperText={errors.title}
            color="success"
            label="What are you naming your project?"
            variant="outlined"
            name="title"
            value={formData.title}
            onChange={handlechange}
            fullWidth
            required
          />

          <TextField
            color="success"
            label="Describe the project you have undertaken"
            variant="outlined"
            name="description"
            value={formData.description}
            onChange={handlechange}
            fullWidth
            multiline
            rows={4}
            required
            error={!!errors.description}
            helperText={errors.description}
          />

          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel color="success" htmlFor="outlined-adornment-amount">Amount</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={<InputAdornment position="start">₹</InputAdornment>}
              name="amount"
              value={formData.amount}
              onChange={handlechange}
              label="Amount"
              required
              color="success"
              error={!!errors.amount}
              helperText={errors.amount}
            />
          </FormControl>

          <TextField
            color="success"
            label="Location"
            variant="outlined"
            name="location"
            value={formData.location}
            onChange={handlechange}
            fullWidth
            required
            error={!!errors.location}
            helperText={errors.location}
          />

          <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
            Please upload images of your project:
          </Typography>

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            sx={{ backgroundColor: "green" }}
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              name="file"
            />
          </Button>

          {errors.file && (
            <Typography variant="body2" sx={{ color: "red", mt: 0.5 }}>
              {errors.file}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "green" }}
          >
            POST
          </Button>
        </Box>
      </Container>
    </>
  );
}
