import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { login } from "../../firebase/firebase-auth";
import { AppState } from "../../context/app-context";

const Login = ({ handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAlert } = AppState();

  const handleSubmit = async () => {
    if (!email || !password) {
      setAlert({
        open: true,
        message: "Please fill all the Fields",
        type: "error",
      });
      return;
    }

    try {
      const result = await login(email, password);
      setAlert({
        open: true,
        message: `Login Successful. Welcome back ${result.user.email}`,
        type: "success",
      });
      handleClose();
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  return (
    <div>
      <Box p={3} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <TextField
          variant="outlined"
          type="email"
          label="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          variant="outlined"
          type="password"
          label="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Button variant="contained" size="large" color="primary" onClick={handleSubmit}>
          Login
        </Button>
      </Box>
    </div>
  );
};

export default Login;
