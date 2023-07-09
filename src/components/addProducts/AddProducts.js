import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { Box, Button, TextField, CircularProgress, Typography, Snackbar, Alert } from "@mui/material";
import { AuthContext } from "../../common/AuthContext";
import axios from "axios";
import NavigationBar from "../navigationBar/NavigationBar";
import "./AddProducts.css";

function AddProducts() {
  const { authToken, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id !== undefined;
  const [name, setName] = useState("");
  const [category, setCategory] = useState();
  const [manufacturer, setManufacturer] = useState("");
  const [availableItems, setAvailableItems] = useState();
  const [price, setPrice] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  const [nameError, setNameError] = useState(false);
  const [manufacturerError, setManufacturerError] = useState(false);
  const [availableItemsError, setAvailableItemsError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    if (snackbarSeverity === "success") {
        navigate("/products");
      }
  };

  useEffect(() => {
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
        setSnackbarMessage("Unable to retrieve categories list.");
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
      });
  }, []);

  useEffect(() => {
    if (isEditMode) {
      setDataLoading(true);
      axios
        .get(`http://localhost:8080/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          const data = response.data;
          setName(data.name);
          const categoryName = data.category;
          setCategory({ label: categoryName, value: categoryName });
          setManufacturer(data.manufacturer);
          setAvailableItems(data.availableItems);
          setPrice(data.price);
          setImageUrl(data.imageUrl);
          setProductDescription(data.description);
        })
        .catch( function () {
          setSnackbarMessage("Unable to retrieve products list.");
          setSnackbarOpen(true);
          setSnackbarSeverity("error");
        })
        .finally(() => setDataLoading(false));
    }
  }, [isEditMode, id, authToken]);

  const handleSubmit = (event) => {
    event.preventDefault();

    setNameError(false);
    setManufacturerError(false);
    setAvailableItemsError(false);
    setPriceError(false);

    if (name === "") {
      setName(true);
    }
    if (manufacturer === "") {
      setManufacturer(true);
    }
    if (availableItems === "") {
      setAvailableItemsError(true);
    }
    if (price === "") {
      setPriceError(true);
    }

    if (name && manufacturer && category.value && availableItems && price) {
      if (isEditMode) {
        axios
          .put(
            `http://localhost:8080/api/products/${id}`,
            {
              name: name,
              category: category.value,
              manufacturer: manufacturer,
              availableItems: availableItems,
              price: price,
              imageUrl: imageUrl,
              description: productDescription,
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          )
          .then(function () {
            setSnackbarMessage(`Product ${name} modified successfully`);
            setSnackbarOpen(true);
            setSnackbarSeverity("success");
          })
          .catch(function () {
            setSnackbarMessage(`Error in modifying product ${name}.`);
            setSnackbarOpen(true);
            setSnackbarSeverity("error");
          });
      } else {
        axios
          .post(
            "http://localhost:8080/api/products",
            {
              name: name,
              category: category.value,
              manufacturer: manufacturer,
              availableItems: availableItems,
              price: price,
              imageUrl: imageUrl,
              description: productDescription,
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          )
          .then(function () {
            setSnackbarMessage(`Product ${name} added successfully!`);
            setSnackbarOpen(true);
            setSnackbarSeverity("success");
          })
          .catch(function () {
            setSnackbarMessage(`Error while adding product: ${name}.`);
            setSnackbarOpen(true);
            setSnackbarSeverity("error");
          });
      }
    }
  };

  return (
    <div>
      <NavigationBar isLogged={authToken !== null} isAdmin={isAdmin} />
      <div className="add-edit-container">
        {dataLoading ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <Typography gutterBottom variant="h5" component="p" sx={{ mb: 3 }}>
              {isEditMode ? "Modify Product" : "Add Product"}
            </Typography>
            <TextField
              label="Name"
              onChange={(e) => setName(e.target.value)}
              required
              variant="outlined"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
              value={name}
              error={nameError}
            />
            <div style={{ marginBottom: "30px" }}>
              <CreatableSelect
                className="basic-single"
                classNamePrefix="select"
                name="category"
                placeholder="Select Category..."
                isClearable
                required
                options={categoryList.map((item) => ({
                  label: item,
                  value: item,
                }))}
                value={category}
                onChange={(data) => setCategory(data)}
                menuPortalTarget={document.body}
                styles={{
                    menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                    }),
                }}
              />
            </div>
            <TextField
              label="Manufacturer"
              onChange={(e) => setManufacturer(e.target.value)}
              required
              variant="outlined"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
              value={manufacturer}
              error={manufacturerError}
            />
            <TextField
              label="Available Items"
              onChange={(e) => setAvailableItems(e.target.value)}
              required
              variant="outlined"
              type="number"
              sx={{ mb: 3 }}
              fullWidth
              value={
                availableItems !== undefined
                  ? Number(availableItems)
                  : availableItems
              }
              error={availableItemsError}
            />
            <TextField
              label="Price"
              onChange={(e) => setPrice(e.target.value)}
              required
              variant="outlined"
              type="number"
              value={price !== undefined ? Number(price) : price}
              error={priceError}
              fullWidth
              sx={{ mb: 3 }}
            />
            <TextField
              label="Image URL"
              onChange={(e) => setImageUrl(e.target.value)}
              variant="outlined"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
              value={imageUrl}
            />
            <TextField
              label="Product Description"
              onChange={(e) => setProductDescription(e.target.value)}
              variant="outlined"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
              value={productDescription}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2, width: "100%" }}
            >
              {isEditMode ? "Modify Product" : "Save Product"}
            </Button>
          </form>
        )}
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
      </div>
    </div>
  );
}

export default AddProducts;