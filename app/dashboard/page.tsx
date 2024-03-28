"use client";
import { useEffect, useState } from "react";
import { ITask, IStatus } from "@/lib/interfaces";
import {
  Alert,
  AlertProps,
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
import AddTask from "../components/AddTask";
import AlertSnackbar from "../components/AlertSnackbar";

export default function Dashboard() {
  const { status: loadingSession, data: session } = useSession();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [statusList, setStatusList] = useState<IStatus[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [showAdd, setShowAdd] = useState<Boolean>(false);
  const [alert, setAlert] = useState<any>({
    open: false,
    message: "",
    severity: "info",
  });
  const router = useRouter();

  useEffect(() => {
    if (loadingSession === "unauthenticated" || !session) {
      router.push("/");
    }
  }, [loadingSession, session, router]);

  function resetAlert() {
    setAlert({ open: false, message: " ", severity: "info" });
  }
  async function loadTasks() {
    setLoading(true);
    try {
      const response = await fetch("/api/listtasks");
      if (response.status === 200) {
        const data = await response.json();
        setTasks(data?.data || []);
        setAlert({
          open: true,
          message: "Tasks loaded..",
          severity: "success",
        });
      } else {
        setAlert({
          open: true,
          message: "Something went wrong..",
          severity: "error",
        });
      }
      setLoading(false);
    } catch (e) {
      setAlert({
        open: true,
        message: "Something went wrong..",
        severity: "error",
      });
      setLoading(false);
    }
  }

  async function deleteTask(taskid: string) {
    try {
      const response = await fetch("/api/deletetask", {
        method: "POST",
        body: JSON.stringify({ taskid }),
      });
      if (response.status === 200) {
        const data = await response.json();
        if (data?.message?.status === "success") {
          setAlert({
            open: true,
            message: "Task deleted successfully..",
            severity: "success",
          });

          loadTasks();
        } else {
          setAlert({
            open: true,
            message: data?.message?.message || "Something went wrong..",
            severity: "error",
          });
        }
      }
    } catch (e) {
      setAlert({
        open: true,
        message: "Something went wrong..",
        severity: "error",
      });
    }
  }
  async function handleAddTask(title: string, description: string) {
    try {
      const response = await fetch("/api/createtask", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      if (response.status === 200) {
        const data = await response.json();
        if (data) {
          setAlert({
            open: true,
            message: "Task created..",
            severity: "success",
          });
          loadTasks();
        } else {
          setAlert({
            open: true,
            message: "Something went wrong..",
            severity: "error",
          });
        }
      }

      setShowAdd(false);
    } catch (e) {
      setAlert({
        open: true,
        message: "Something went wrong..",
        severity: "error",
      });
    }
  }
  function changeStatus(taskid: string, statusid: number) {
    const newTasks: ITask[] = tasks?.map((item: ITask) => {
      if (taskid === item?.taskid) {
        const status = statusList?.find(
          (stat: IStatus) => stat?.statusid === statusid
        )?.status!;
        return {
          ...item,
          statusid: statusid,
          status,
        };
      } else {
        return item;
      }
    });

    setTasks(newTasks);
  }

  async function loadStatus() {
    try {
      const response = await fetch("/api/liststatus");
      if (response.status === 200) {
        const data = await response.json();
        if (data?.data) {
          setStatusList(data.data);
        } else {
          setStatusList([]);
        }
      }
    } catch (e) {
      setStatusList([]);
    }
  }

  useEffect(() => {
    loadTasks();
    loadStatus();
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        margin: "5px",
        padding: "5px",
        gap: "5px",
      }}
    >
      <AlertSnackbar setAlert={setAlert} alert={alert}></AlertSnackbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          paddingBottom: "10px",
        }}
      >
        <Typography variant={"h5"} sx={{ textAlign: "left" }}>
          My Tasks..
        </Typography>
        <Fab
          size="small"
          color="primary"
          aria-label="add"
          onClick={() => setShowAdd(true)}
        >
          <AddIcon />
        </Fab>
      </Box>
      {showAdd && (
        <AddTask
          setShowAdd={setShowAdd}
          handleAddTask={handleAddTask}
        ></AddTask>
      )}

      {loading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "90vh",
            overflowX: "auto",
          }}
        >
          <CircularProgress></CircularProgress>
          <Typography>Loading tasks.</Typography>
        </Box>
      )}
      {tasks?.map((task: ITask) => (
        <Task
          key={task.taskid}
          task={task}
          deleteTask={deleteTask}
          changeStatus={changeStatus}
          status={statusList}
        ></Task>
      ))}

      {tasks?.length === 0 && !loading && (
        <Typography>No tasks to display.Create one to continue </Typography>
      )}
    </Box>
  );
}
