import { Button, Grid, IconButton, Typography } from "@mui/material";
import { Card, CardContent, CardActions, CardMedia } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

  
  function Cards(props) {
    const { key, productData, isAdmin, handleDeleteCall, navigate } = props;
  
    return (
      <Grid key={key} item xs={4}>
        <Card>
          <CardMedia
            sx={{ height: 150 }}
            image={
              productData.imageUrl.length > 0
                ? productData.imageUrl
                : "https://via.placeholder.com/600/771796"
            }
            title={productData.name}
          />
          <CardContent sx={{ height: 150 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography gutterBottom variant="h5" component="div">
                {productData.name}
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                ₹{productData.price}
              </Typography>
            </div>
            <Typography variant="body2" color="text.secondary">
              {productData.description}
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              alignSelf: "stretch",
              display: "flex",
              justifyContent: isAdmin ? "space-between" : "flex-start",
              margin: "0 10px",
            }}
          >
            <div>
              <Button
                size="small"
                variant="contained"
                onClick={() => navigate(`/products/${productData.id}`)}
              >
                Buy
              </Button>
            </div>
            {isAdmin && (
              <div>
                <IconButton onClick={handleDeleteCall}>
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  onClick={() => navigate(`/edit-product/${productData.id}`)}
                >
                  <EditIcon />
                </IconButton>
              </div>
            )}
          </CardActions>
        </Card>
      </Grid>
    );
  }
  
  export default Cards;