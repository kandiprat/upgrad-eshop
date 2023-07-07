import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/components/loginPage/Login";
import SignUp from "../src/components/signUpPage/SignUp";
import { ThemeProvider, createTheme } from "@mui/material";
import { AuthContextProvider } from "../src/common/AuthContext";
import Products from "../src/components/productsPage/Products";

const appTheme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f44336",
    },
  },
});

function App() {
  return (
    <AuthContextProvider>
      <ThemeProvider theme={appTheme}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route exact path="/" element={<Navigate to="/login" />} />
            <Route exact path="/products" element={<Products />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthContextProvider>
  );
}

export default App;