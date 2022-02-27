import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { signup, createUserDocument } from "../../firebase/firebase-auth";
import { AppState } from "../../context/app-context";

const SignUp = ({ handleClose }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { setAlert } = AppState();

  const handleSubmit = async () => {
    if (!userName || !email || !password || !confirmPassword) {
      setAlert({
        open: true,
        message: "Please fill all the Fields",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({
        open: true,
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    try {
      const result = await signup(email, password);
      await createUserDocument(result.user, { userName: userName, role: "basic" });
      setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${result.user.email}`,
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
          type="text"
          label="Enter Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          fullWidth
        />
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
        <TextField
          variant="outlined"
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
        />
        <Button variant="contained" size="large" color="primary" onClick={handleSubmit}>
          Sign Up
        </Button>
      </Box>
    </div>
  );
};

export default SignUp;
