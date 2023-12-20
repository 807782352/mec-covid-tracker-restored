import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import Menu from "@mui/icons-material/Menu";
import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Covid-Tracker
          </Typography>
          <Button color="inherit" href="/home">
            Home
          </Button>
          <Button color="inherit" href="/map">
            Map
          </Button>
          <Button color="inherit" href="/Login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}
