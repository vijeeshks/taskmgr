import Box from "@mui/material/Box";
import LoginForm from "./components/Form";

export default function LoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <LoginForm />
    </Box>
  );
}
