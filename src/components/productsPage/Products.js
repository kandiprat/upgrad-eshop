import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../navigationBar/NavigationBar";
import Cards from "../cards/Cards";
import { FormControl, ToggleButtonGroup, ToggleButton, Grid, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from "axios";
import { AuthContext } from "../../common/AuthContext";
import "./Products.css";


function Products() {
  const { authToken, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [data, setData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  const triggerDataFetch = () => {
    if (authToken !== null) {
      axios
        .get("http://localhost:8080/api/products/categories", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(function (response) {
          setCategoryList(response.data);
        })
        .catch(function () {
          alert("Unable to retrieve categories list.");
        });
      axios
        .get("http://localhost:8080/api/products", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          if (response.data.length > 0) {
            setOriginalData(response.data);
            setData(response.data);
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    triggerDataFetch();
  }, []);

  const handleCategoryChange = (event, newCategory) => {
    const newData =
      newCategory === "all"
        ? originalData
        : originalData.filter((item) => item.category === newCategory);
    setCategory(newCategory);
    setData(newData);
  };

  const handleSortChange = (event) => {
    const keyString = event.target.value;
    let newData = [...originalData];
  
    if (keyString === "default") {
      newData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (keyString === "new") {
      newData.sort((a, b) => new Date(b.date) - new Date(a.date)).reverse();
    } else if (keyString === "lowToHigh") {
      newData.sort((a, b) => a.price - b.price);
    } else if (keyString === "highToLow") {
      newData.sort((a, b) => b.price - a.price);
    } 
  
    setData(newData);
    setSortBy(keyString);
  };  
  

  const handleSearchChange = (event) => {
    const newData = originalData.filter((item) =>
      item.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setData(newData);
    setSearchTerm(event.target.value);
  };

  const handleDeleteCall = (id) => {
    setProductIdToDelete(id);
    setShowConfirmation(true);
  };

  const handleDeleteConfirmed = () => {
    axios
      .delete(`http://localhost:8080/api/products/${productIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then(function () {
        triggerDataFetch();
      })
      .catch(function (error) {
        alert("Please try again later.");
      });

    // Reset the confirmation state
    setShowConfirmation(false);
    setProductIdToDelete(null);
  };

  const handleDeleteCancelled = () => {
    // Reset the confirmation state
    setShowConfirmation(false);
    setProductIdToDelete(null);
  };

  return (
    <Fragment>
      <NavigationBar
        isLogged={authToken !== null}
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      {originalData.length > 0 ? (
        <div className="products-container">
          <div className="category-section">
            <ToggleButtonGroup
              color="primary"
              value={category}
              exclusive
              onChange={handleCategoryChange}
              aria-label="Category"
            >
              <ToggleButton key="all" value="all">
                ALL
              </ToggleButton>
              {categoryList.map((category) => (
                <ToggleButton key={category} value={category}>
                  {category.toUpperCase()}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>

          <div>
            <FormControl className="sort-by-dropdown">
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sortBy}
                label="Sort"
                onChange={handleSortChange}
              >
                <MenuItem value={"default"}>Default</MenuItem>
                <MenuItem value={"highToLow"}>Price: High to Low</MenuItem>
                <MenuItem value={"lowToHigh"}>Price: Low to High</MenuItem>
                <MenuItem value={"new"}>Newest</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Grid container spacing={5} style={{ margin: "10px 0" }}>
            {data.map((item) => (
              <Cards
                key={item.id}
                productData={item}
                isAdmin={isAdmin}
                handleDeleteCall={() => handleDeleteCall(item.id)}
                navigate={navigate}
              />
            ))}
              <Dialog
                open={showConfirmation}
                onClose={handleDeleteCancelled}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  Confirm deletion of product!
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete the product?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button 
                    onClick={handleDeleteConfirmed} 
                    autoFocus 
                    variant="contained"
                    color="primary"
                  >
                    OK
                  </Button>
                  <Button 
                    variant="outlined"
                    color="primary"
                    onClick={handleDeleteCancelled}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
          </Grid>
        </div>
      ) : (
        <Typography gutterBottom variant="body1" component="p">
          No products available.
        </Typography>
      )}
    </Fragment>
  );
}

export default Products;