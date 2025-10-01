import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Contexts/toastContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import ChatIcon from "@mui/icons-material/Chat";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Navbar() {
  //boilerplate for the menu icon
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const { showSuccess } = useToast();

  //setting value, true or false based on the user logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const check = localStorage.getItem("token");
    if (check) {
      setIsAuthenticated(true);
      setUserId(jwtDecode(check).id);
    } else {
      setIsAuthenticated(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    async function getData() {
      if (!isAuthenticated) return;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/myprofile/${userId}`
      );
      setData(response.data);
    }
    getData();
  }, [isAuthenticated]);

  function handleLogout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false)
    showSuccess("Bye!");
    navigate("/");
  }

  function openChat() {
    navigate("/chat");
  }
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ backgroundColor: "green" }}>
          <Toolbar>
            
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontSize: { xs: "1rem", sm: "1.2rem" } }}
            >
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to={`/`}
              >
                Mother Earth
              </Link>
            </Typography>

            {/* start a project */}
            <Button
              style={{
                backgroundColor: "inherit",
                border: "none",
                cursor: "pointer",
                color: "white",
                paddingTop: "7px",
                marginRight: "7px",
              }}
            >
              {" "}
              <Link
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontSize: { xs: "0.5rem", sm: "0.8rem", lg: "1rem" },
                }}
                to={"/post"}
              >
                new project
              </Link>
            </Button>

            {/* show all projects */}
            <Button
              style={{
                backgroundColor: "inherit",
                border: "none",
                cursor: "pointer",
                color: "white",
                paddingTop: "7px",
                marginRight: "7px",
              }}
            >
              <Link
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontSize: { xs: "0.5rem", sm: "0.8rem", lg: "1rem" },
                }}
                to={"/allposts"}
              >
                Projects
              </Link>
            </Button>

            {/* chat */}
            <Button
              onClick={openChat}
              style={{
                backgroundColor: "inherit",
                border: "none",
                cursor: "pointer",
                color: "white",
                paddingTop: "7px",
              }}
            >
              {" "}
              <ChatIcon />
            </Button>

            {/* menu icon */}
            <React.Fragment>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                  maxWidth: "3rem"
                }}
              >
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar
                      alt={data?.username.charAt(0) ||""}
                      src={data?.url || ""}
                      sx={{ width: 32, height: 32 }}
                    ></Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {isAuthenticated
                  ? [
                      <MenuItem onClick={handleClose} key="profile"> 
                        <Avatar alt="m" src={data?.url || ""} />
                        <Link
                          style={{ textDecoration: "none", color: "inherit" }}
                          to={"/myprofile"}
                        >
                          My Profile
                        </Link>
                      </MenuItem>,
                      <Divider key="divider-auth" />,
                      <MenuItem onClick={handleClose} key="logout">
                        <Button onClick={handleLogout}>
                          <ListItemIcon>
                            <Logout fontSize="small" />
                          </ListItemIcon>
                          Logout
                        </Button>
                      </MenuItem>,
                    ]
                  : [
                      <MenuItem onClick={handleClose} key="login">
                        <Link
                          style={{ textDecoration: "none", color: "inherit" }}
                          to={"/login"}
                        >
                          Login
                        </Link>
                      </MenuItem>,
                      <Divider key="divider-unauth" />,
                      <MenuItem onClick={handleClose} key="signup">
                        <Link
                          style={{ textDecoration: "none", color: "inherit" }}
                          to={"/signup"}
                        >
                          Signup
                        </Link>
                      </MenuItem>,
                    ]}
              </Menu>
            </React.Fragment>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
