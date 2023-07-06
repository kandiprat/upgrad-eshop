import { useContext } from "react";
import { AppBar, Toolbar, Typography , IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../common/AuthContext";
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

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

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "75%",
  }));
  
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));

  return (
    <AppBar position="static" className="app-primary-color">
      <Toolbar>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={2}>
            <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="menu"
              disableRipple
              onClick={() => navigate(isLogged ? "/products" : "/login")}
            >
              <ShoppingCartIcon />
            </IconButton>
            <Typography variant="body1" component="span">
              upGrad E-Shop
            </Typography>
          </Grid>
          <Grid item xs={6} alignSelf="center">
            <Search className="search">
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                />
            </Search>
          </Grid>
          <Grid item xs={4} textAlign="right">
            <Box display="flex" justifyContent="flex-end" gap={2}>
              {isLogged ? (
                <>
                  <Button
                    color="inherit"
                    variant="text"
                    onClick={() => navigate("/products")}
                  >
                    Home
                  </Button>
                  {isAdmin && (
                    <Button
                      color="inherit"
                      variant="text"
                      onClick={() => navigate("/add-product")}
                    >
                      Add Product
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    variant="text"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    variant="text"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </Button>
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

