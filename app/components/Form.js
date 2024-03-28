"use client";

import { Box, Button, Paper, TextField } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, Suspense, useEffect, useState } from "react";

const LoginFormComponent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const { status: loadingSession, data: session } = useSession();
  const [email, setEmail] = useState("vijeesh.ks@gmail.com");
  const [password, setPassword] = useState("test");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (loadingSession === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [loadingSession, session, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setEmail("");
      setPassword("");

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
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
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
            />
          </Box>
          <Box>
            <TextField
              required
              type="password"
              name="pwd"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
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
