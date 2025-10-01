import { Box, Typography, Button } from "@mui/material";
import { motion } from "motion/react";
import React from "react";
import { Link } from "react-router-dom";

//intializing a custom <Box> supercharged with motion
const customBox = React.forwardRef(function MotionCompatibleBox(props, ref) {
  return <Box ref={ref} {...props} />;
});
//motion.create function actually creates the supercharged component
const MotionBox = motion.create(customBox);

const customTypo = React.forwardRef(function MotionCompatibleBox(props, ref) {
  return <Typography ref={ref} {...props} />;
});

const MotionTypo = motion.create(customTypo);

export default function Hero() {
  return (
    <>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "black",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ zIndex: 2, ml:8, pt: 8 }}>
          <MotionTypo
            animate={{ opacity: [0, 1], y: [10, 0] }}
            transition={{
              duration: 2,
              type: "spring",
            }}
            sx={{
              color: "white",
              width: "70vw",
              fontSize: {
                xs: "2rem", 
                sm: "3rem", 
                md: "4rem", 
                lg: "5rem", 
              },
            }}
          >
            Let's transform the planet together!
          </MotionTypo>
          
           <Button sx={{my: 2, backgroundColor: "green"}} variant="contained">
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to={"/post"}
              >
                Start a Project
              </Link>
            </Button>
        </Box>

        <MotionBox
          animate={{ rotate: 360 }}
          transition={{
            duration: 40,
            repeat: Infinity,
            easing: "linear",
          }}
          sx={{
            zIndex: 1,
          }}
        >
          <img src="../planet-earth-svgrepo-com.svg" alt="earth" />
        </MotionBox>
      </Box>
    </>
  );
}
