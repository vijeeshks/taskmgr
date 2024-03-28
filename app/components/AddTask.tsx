"use client";
import { useEffect, useState } from "react";
import { ITask, IStatus } from "@/lib/interfaces";
import {
  Box,
  Button,
  CircularProgress,
  Fab,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Task from "../components/Task";
import AddIcon from "@mui/icons-material/Add";

export default function AddTask({
  handleAddTask,
  setShowAdd,
}: {
  handleAddTask(title: string, description: string): void;
  setShowAdd(val: Boolean): void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleAddClick() {
    if (title && description) {
      handleAddTask(title, description);
      setTitle("");
      setDescription("");
    }
  }

  return (
    <Box>
      <TextField
        required
        fullWidth
        id="title-required"
        label="Title"
        value={title}
        onChange={(e: any) => setTitle(e.target.value)}
      />
      <TextField
        fullWidth
        id="desc-disabled"
        label="Description"
        value={description}
        multiline
        onChange={(e: any) => setDescription(e.target.value)}
      />
      <Box
        sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}
      >
        <Button onClick={() => setShowAdd(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleAddClick}>
          Add
        </Button>
      </Box>
    </Box>
  );
}
