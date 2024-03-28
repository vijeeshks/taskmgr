import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DeleteConfirmModal({
  open,
  setOpen,
  deleteTask,
  taskId,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  deleteTask: (val: string) => void;
  taskId: string;
}) {
  const handleClose = () => {
    setOpen(false);
  };

  function handleDeleteClick() {
    deleteTask(taskId);
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Delete Task?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you want to delete this task..?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDeleteClick} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
