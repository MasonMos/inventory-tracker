"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { BsBoxes } from "react-icons/bs";

export default function Home() {
  return (
    <Box
      width="100vw"
      height="100vh"
      alignItems={"center"}
      display={"flex"}
      flexDirection={"column"}
      padding={4}
      sx={{ flexGrow: 1, width: "100%", px: 2 }}
    >
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            href="/"
          >
            <BsBoxes />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        textAlign={"center"}
        alignItems={"center"}
        flexGrow={1}
      >
        <Typography variant="h4" component="div">
          Welcome to Inventory Tracker
        </Typography>
        <Typography variant="body1" component="p">
          This is a simple inventory tracker app that allows you to keep track
          of your inventory. You can add items, search for items, and view your
          inventory.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ marginTop: 4 }}
          href="/tracker"
        >
          Get Started
        </Button>
        <Typography variant="body2" component="p" sx={{ marginTop: 2 }}>
          Made with NextJs, ReactJs, MUI, GPT Vision, and Firebase
        </Typography>
      </Box>
    </Box>
  );
}
