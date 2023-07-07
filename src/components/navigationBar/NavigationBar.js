import { useContext } from "react";
import { AppBar, Toolbar, Typography, IconButton, InputBase } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button, Grid, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../common/AuthContext";
import SearchBar from "../searchBar/SearchBar";

function NavigationBar(props) {
  const { isLogged, isAdmin, searchTerm, onSearchChange } = props;
  const { setToken, setUserId, setIsAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setUserId(null);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <AppBar position="static" className="app-primary-color">
      <Toolbar>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={5}>
            <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="menu"
              disableRipple
              onClick={() => navigate(isLogged ? "/products" : "/login")}
            >
                <ShoppingCartIcon />
                <Typography variant="body1" component="span">
                    upGrad E-Shop
                </Typography>
            </IconButton>
          </Grid>
          
          <Grid item xs={3}>
          {isLogged && (
            <SearchBar searchText={searchTerm} onSearchChange={onSearchChange} />
            )}
          </Grid>
          <Grid item xs={4} textAlign="right">
            <Box display="flex" justifyContent="flex-end" gap={2}>
              {isLogged ? (
                <>
                <Box display="flex" alignItems="center" gap={2}>
                  <Link
                    to = "/products"
                    color="inherit"
                    variant="text"
                    underline={true}
                    component={Button}
                    style={{ color: 'white' }} 
                  >
                    Home
                  </Link>
                  {isAdmin && (
                    <Link
                      to = "/add-product"
                      color="inherit"
                      variant="text"
                      underline={true}
                      component={Button}
                      style={{ color: 'white' }}                     
                    >
                      Add Product
                    </Link>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogout}
                  >
                    LOGOUT
                  </Button>
                </Box>
                </>
              ) : (
                <>
                  <Link
                    to = "/login"
                    color="inherit"
                    variant="text"
                    underline={true}
                    component={Button}
                    style={{ color: 'white' }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    color="inherit"
                    variant="text"
                    underline={true}
                    component={Button}
                    style={{ color: 'white' }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;

