"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as React from "react";
import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditWrapper from "../components/EditWrapper";
import AddIcon from "@mui/icons-material/Add";
import CreateNewsDialog from "../components/CreateNewsDialog";

export default function Reporter() {
  const theme = useTheme();
  const [valueView, setValueView] = React.useState("edit");
  const { status, loadingSession, data: session } = useSession();
  const [refreshData, setRefereshData] = useState(false);
  const [authorized, setAuthorised] = useState(false);
  const [open, setOpen] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("login");
      return;
    }
    if (session && pathName) {
      if (!session.user?.roles?.find((role) => `/${role.url}` === pathName)) {
        router.push("login");
      } else {
        setAuthorised(true);
      }
    }
  }, [pathName, session, router, status]);

  function handleViewClick(type) {
    setValueView(type);
  }
  if (!authorized) {
    return <h1>Not authorized</h1>;
  }

  function handleCreateClick() {
    setOpen(true);
  }

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <CreateNewsDialog
        setRefreshData={setRefereshData}
        open={open}
        setOpen={setOpen}
      ></CreateNewsDialog>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          paddingBottom: "10px",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        <Button
          size="large"
          color="secondary"
          variant={valueView === "live" ? "contained" : "outlined"}
          onClick={() => handleViewClick("live")}
        >
          Live
        </Button>
        <Button
          size="large"
          variant={valueView === "edit" ? "contained" : "outlined"}
          onClick={() => handleViewClick("edit")}
        >
          Edit
        </Button>
        <Fab color="primary" aria-label="add" onClick={handleCreateClick}>
          <AddIcon />
        </Fab>
      </Box>
      {valueView === "edit" && (
        <EditWrapper
          refreshData={refreshData}
          setRefereshData={setRefereshData}
        ></EditWrapper>
      )}
    </Box>
  );
}
