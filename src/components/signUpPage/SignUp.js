import { Avatar, Button, TextField, Typography, Snackbar, Alert } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import NavigationBar from "../navigationBar/NavigationBar";

import "./SignUp.css";

function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [contactNumberError, setContactNumberError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    if (snackbarSeverity === "success") {
      navigate("/login");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setFirstNameError(false);
    setLastNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setContactNumberError(false);

    if (firstName === "") {
      setFirstNameError(true);
    }
    if (lastName === "") {
      setLastNameError(true);
    }
    if (email === "") {
      setEmailError(true);
    }
    if (password === "") {
      setPasswordError(true);
    }
    if (contactNumber === "") {
      setContactNumberError(true);
    }

    if (firstName && lastName && email && password && contactNumber) {
      axios
        .post("http://localhost:8080/api/auth/signup", {
          firstName,
          lastName,
          email,
          password,
          contactNumber,
        })
        .then(function (response) {
          setSnackbarMessage(response.data.message);
          setSnackbarOpen(true);
          setSnackbarSeverity("success");
        })
        .catch(function (error) {
          setSnackbarMessage("Unable to register the user, please try again.");
          setSnackbarOpen(true);
          setSnackbarSeverity("error");
        });
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="signupContainer">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Avatar className="avatarStyle">
            <LockIcon />
          </Avatar>
          <Typography gutterBottom variant="h5" component="p">
            Sign up
          </Typography>
          <TextField
            label="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            required
            variant="outlined"
            type="text"
            sx={{ mb: 3 }}
            fullWidth
            value={firstName}
            error={firstNameError}
          />
          <TextField
            label="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            required
            variant="outlined"
            type="text"
            sx={{ mb: 3 }}
            fullWidth
            value={lastName}
            error={lastNameError}
          />
          <TextField
            label="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
            type="email"
            sx={{ mb: 3 }}
            fullWidth
            value={email}
            error={emailError}
          />
          <TextField
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            type="password"
            value={password}
            error={passwordError}
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            variant="outlined"
            type="password"
            value={confirmPassword}
            error={password.length > 0 && confirmPassword !== password}
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="Contact Number"
            onChange={(e) => setContactNumber(e.target.value)}
            required
            variant="outlined"
            type="tel"
            sx={{ mb: 3 }}
            fullWidth
            value={contactNumber}
            error={contactNumberError}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2, width: "100%" }}
            disabled={password.length > 0 && confirmPassword !== password}
          >
            Sign Up
          </Button>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              elevation={6}
              variant="filled"
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <div className="loginLink">
            <Link to="/login">Already have an account? Sign in</Link>
          </div>
        </form>
      </div>
      <div className="signupFooter">
        Copyright &copy; <Link href="https://www.upgrad.com/">upGrad</Link> 2023
      </div>
    </>
  );
}

export default SignUp;
