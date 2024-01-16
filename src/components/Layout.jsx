import { AppBar, Button,  Toolbar, Typography } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Covid-Tracker
          </Typography>

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
