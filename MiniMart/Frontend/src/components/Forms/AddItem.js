import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import marketBackground from "../assets/image/marketBackground.jpg";
import { useForm } from "react-hook-form";
import AdminNav from "../layout/AdminNav";
export default function AddItem() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = (data) => {
    fetch("http://localhost:3000/add-item", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then((result) => result.json())
      .then((result) => {
        reset();

        if (result.status) {
          reset();
        } else alert(result.msg);
      });
  };
  return (
    <>
      <AdminNav />
      <Box
        style={{
          backgroundImage: `url(${marketBackground})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundAttachment: "fixed",
          width: "100%",
          height: "100%",
          position: "fixed",
          zIndex: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgb(255,255,255,0.7)",
            width: "90%",
            height: "90%",
            borderRadius: "25px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 style={{ color: "#1976cd" }}>Add Item</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              sx={{ width: "100%", mt: 2 }}
              label="Item Name"
              variant="outlined"
              {...register("itemName", {
                required: "item Name Address is Required",
              })}
            />
            {errors.itemName && (
              <span
                className="error"
                style={{ color: "red", fontSize: "13px" }}
              >
                {errors.itemName.message}
              </span>
            )}
            <FormControl sx={{ width: "100%", mt: 2 }}>
              <InputLabel id="demo-simple-select-autowidth-label">
                Item Category
              </InputLabel>
              <Select
                label="Item Category"
                {...register("itemCategory", {
                  required: "item Category is Required",
                })}
              >
                <MenuItem value={"vegetables"}>Vegetables</MenuItem>
                <MenuItem value={"fruits"}>Fruits</MenuItem>
                <MenuItem value={"drinks"}>Drinks</MenuItem>
                <MenuItem value={"snacks"}>Snacks</MenuItem>
                <MenuItem value={"cleaning"}>Cleaning</MenuItem>
                <MenuItem value={"electronics"}>Electronics</MenuItem>
              </Select>
            </FormControl>
            {errors.itemCategory && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {errors.itemCategory.message}
              </span>
            )}
            <TextField
              sx={{ width: "100%", mt: 2 }}
              id="filled-basic"
              label="Item Price"
              variant="outlined"
              type="text"
              {...register("itemPrice", {
                required: "Item Price is Required",
              })}
            />
            {errors.itemPrice && (
              <span
                className="error"
                style={{ color: "red", fontSize: "13px" }}
              >
                {errors.itemPrice.message}
              </span>
            )}
            <TextField
              sx={{ width: "100%", mt: 2 }}
              id="filled-basic"
              label="Image URL"
              variant="outlined"
              inputProps={{
                type: "text",
                title: "Please enter a valid URL",
              }}
              {...register("img", {
                required: "Image URL is Required",
              })}
            />
            {errors.img && (
              <span
                className="error"
                style={{ color: "red", fontSize: "13px" }}
              >
                {errors.img.message}
              </span>
            )}
            <Button
              type="submit"
              sx={{ width: "100%", mt: 2, background: "rgb(	255	,195,	0,0.8)" }}
            >
              Add
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
}
