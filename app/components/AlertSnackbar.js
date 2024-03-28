import { Alert, Snackbar } from "@mui/material";

export default function AlertSnackbar({ alert, setAlert }) {
  return (
    <Snackbar
      open={alert.open}
      onClose={() => setAlert({ open: false, message: "" })}
      autoHideDuration={6000}
    >
      <Alert variant="filled" severity={"info"}>
        {alert.message}
      </Alert>
    </Snackbar>
  );
}
