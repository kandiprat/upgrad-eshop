import { useContext, useState } from "react";
import { Alert, Avatar, Button, TextField, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../common/AuthContext";
import NavigationBar from "../navigationBar/NavigationBar";
import jwt_decode from 'jwt-decode';

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { authToken, setToken, setUserId, setIsAdmin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setEmailError(false);
    setPasswordError(false);

    if (email === "") {
      setEmailError(true);
    }
    if (password === "") {
      setPasswordError(true);
    }

    if (email && password) {
      axios
        .post("http://localhost:8080/api/auth/signin", {
          username: email,
          password: password,
        })
        .then(function (response) {
          if (response.data.token) {
            setToken(response.data.token);
    
            // Extract email from the token
            const decodedToken = jwt_decode(response.data.token);
            const userEmail = decodedToken.sub;

            // Fetch user details using the email
            axios
            .get("http://localhost:8080/api/users", {
              headers: {
                Authorization: `Bearer ${response.data.token}`,
              },
            })
              .then(function (usersResponse) {
                const users = usersResponse.data;
                const user = users.find((user) => user.email === userEmail);
                console.log("entered auth users method{}",user.id);
                if (user) {
                  if (user.id) {
                    setUserId(user.id);
                    console.log("user id is present{}",user.id);
                  }
                  if (user.roles && user.roles.some((role) => role.name === "ADMIN")) {
                    setIsAdmin(true);
                    console.log("user id is present{}",user.roles);
                  }
                  navigate("/products");
                } else {
                  alert("Error: User not found.");
                }
              })
              .catch(function (error) {
                alert("Error: Failed to fetch user details.");
              });
          }
        })
        .catch(function () {
          alert("Error: Invalid credentials.");
        });
    }
  } 
    

  if (authToken) {
    navigate("/products");
  }

  return (
    <>
      <NavigationBar />
      <div className="loginContainer">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Avatar className="avatarStyle">
            <LockIcon />
          </Avatar>
          <Typography gutterBottom variant="h5" component="p">
            Sign in
          </Typography>
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2, width: "100%" }}
          >
            Sign In
          </Button>
          <div className="signupLink">
            <Link to="/signup">Don't have an account? Sign up</Link>
          </div>
        </form>
      </div>
      <div className="loginFooter">
        Copyright &copy; <Link href="https://www.upgrad.com/">upGrad</Link> 2023
      </div>
    </>
  );
}

export default Login;
