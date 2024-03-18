"use client";

import { Box, Button, Paper, TextField } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, Suspense, useEffect, useState } from "react";

const LoginFormComponent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "vijeesh.ks@gmail.com",
    pwd: "test",
  });
  const [error, setError] = useState("");
  const { status, loadingSession, data: session } = useSession();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

  useEffect(() => {
    if (!loadingSession && session && router) {
      const roles = session.user.roles;
      if (roles && roles?.length > 0) {
        let defaultRole = roles.find((role) => role?.isdefault === 1);
        if (!defaultRole) {
          defaultRole = roles[0];
        }
        if (defaultRole) {
          const url = `/${defaultRole.url}`;
          router.push(url);
        }
      }
    }
  }, [loadingSession, session, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFormValues({ username: "", pwd: "" });

      const res = await signIn("credentials", {
        redirect: false,
        email: formValues.username,
        password: formValues.pwd,
        callbackUrl,
      });
      setLoading(false);

      if (!res?.error) {
        // router.push(callbackUrl);
      } else {
        setError("invalid email or password");
      }
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <Box>
      <form onSubmit={onSubmit}>
        {error && <p>{error}</p>}
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "20px",
            gap: "20px",
          }}
        >
          <Box>
            <TextField
              required
              type="email"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              placeholder="Email address"
            />
          </Box>
          <Box>
            <TextField
              required
              type="password"
              name="pwd"
              value={formValues.pwd}
              onChange={handleChange}
              placeholder="Password"
            />
          </Box>
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? "loading..." : "Sign In"}
          </Button>
        </Paper>
      </form>
    </Box>
  );
};

export default function LoginForm() {
  return (
    <Suspense>
      <LoginFormComponent></LoginFormComponent>
    </Suspense>
  );
}
