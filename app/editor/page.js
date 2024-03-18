"use client";
import { Box } from "@mui/material";
import { signOut, useSession } from "next-auth/react";

export default function Editor() {
  const session = useSession();
  return (
    <Box>
      <h1>Editor-JanhithAdmin</h1>;<button onClick={signOut}>Signout</button>
    </Box>
  );
}
