import {
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { IStatus, ITask } from "@/lib/interfaces";
import DoneIcon from "@mui/icons-material/Done";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmModal from "./DeleteConfirmDialog";

export default function Task({
  task,
  status,
  changeStatus,
  deleteTask,
}: {
  task: ITask;
  status: IStatus[];
  changeStatus: (taskid: string, statusid: number) => void;
  deleteTask: (taskid: string) => void;
}) {
  const [statusChanging, setStatusChanging] = useState(false);
  const [open, setOpen] = useState(false);
  async function handleChangeStatus(statusid: number, taskid: string) {
    if (task.statusid === statusid) {
      return;
    }
    setStatusChanging(true);
    try {
      const response = await fetch("/api/changestatus", {
        method: "POST",
        body: JSON.stringify({
          taskid: task.taskid,
          statusid,
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
        if (data?.message?.status === "success") {
          changeStatus(task.taskid, statusid);
        }
      }
      setStatusChanging(false);
    } catch (e) {
      setStatusChanging(false);
    }
  }
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start",
        padding: "2px",
      }}
    >
      {open && (
        <DeleteConfirmModal
          open={open}
          setOpen={setOpen}
          deleteTask={deleteTask}
          taskId={task.taskid}
        ></DeleteConfirmModal>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: "2px",
        }}
      >
        <Typography variant="h6">{task.title}</Typography>
        <Typography>{task.description}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          padding: "5px",
          gap: "2px",
          width: "100%",
        }}
      >
        {statusChanging && <CircularProgress></CircularProgress>}

        {status?.map((item) => (
          <Chip
            onClick={() => {
              handleChangeStatus(item.statusid, task.taskid);
            }}
            icon={
              task.statusid === item.statusid ? (
                <DoneIcon />
              ) : (
                <ChevronRightIcon />
              )
            }
            size="small"
            color={item.statusid === task.statusid ? "primary" : "default"}
            key={item.statusid}
            label={item.status}
          ></Chip>
        ))}

        <IconButton color="error" onClick={() => setOpen(true)}>
          <DeleteIcon></DeleteIcon>
        </IconButton>
      </Box>
    </Paper>
  );
}
