"use client";
import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Header(props) {
  const { status: loadingSession, data: session } = useSession();
  const router = useRouter();
  if (!loadingSession && !session) {
    router.push("/");
  }

  function logoutClick() {
    signOut();
    router.push("/");
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          {session && (
            <Typography variant="caption" component="div" sx={{ flexGrow: 1 }}>
              {session.user.email}
            </Typography>
          )}
          {session && <LogoutIcon onClick={logoutClick}></LogoutIcon>}
        </Toolbar>
      </AppBar>

      <Box component="main">
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}
