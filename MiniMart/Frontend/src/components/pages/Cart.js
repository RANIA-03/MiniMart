import React, { useContext, useEffect, useState } from "react";
import MainNav from "../layout/MainNav";
import { Context } from "../../App";
import MainNavSigned from "../layout/MainNavSigned";
import { Box, Button, Grid, Typography } from "@mui/material";
import Image from "mui-image";
import AdminNav from "../layout/AdminNav";

export default function Cart() {
  const { totalCart, isSigned, setTotalCart, setCount, currentUser } =
    useContext(Context);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  }, []);

  useEffect(() => {
    setCount(cartItems.length);
    let newTotalCart = cartItems.reduce(
      (total, item) => total + item.itemPrice * item.itemCounter,
      0
    );
    setTotalCart(newTotalCart.toFixed(2));
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems, setCount, setTotalCart]);

  const updateCartItemCounter = (_id, newCounter) => {
    if (newCounter <= 0) {
      removeItemFromCart(_id);
    } else {
      const updatedItems = cartItems.map((item) => {
        if (item._id === _id) {
          return { ...item, itemCounter: newCounter };
        }
        return item;
      });
      setCartItems(updatedItems);
    }
  };

  const removeItemFromCart = (_id) => {
    const updatedItems = cartItems.filter((item) => item._id !== _id);
    setCartItems(updatedItems);
  };
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleOrder = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));

    const orderData = {
      total: totalCart,
      userId: currentUser._id,
      cartItems: cartItems,
    };
    // console.log("Order clicked!");
    fetch("http://localhost:3000/order", {
      method: "POST",
      body: JSON.stringify(orderData),
      headers: { "Content-Type": "application/json" },
    })
      .then((result) => result.json())
      .then((result) => {});
    localStorage.removeItem("cartItems");
    setTotalCart("0.00");
    setCount(0);
    setOrderPlaced(true);
  };

  return (
    <>
      {currentUser.role === "admin" ? (
        <AdminNav />
      ) : !isSigned ? (
        <MainNav />
      ) : (
        <MainNavSigned />
      )}

      {!isSigned ? (
        <Box sx={{ m: 3, display: "flex", justifyContent: "center" }}>
          <h1>Log in to include items in the shopping cart</h1>
        </Box>
      ) : (
        <Box sx={{ m: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <h1>All Items :</h1> <h1>Total : {totalCart}💲</h1>
            {isSigned && cartItems.length > 0 && !orderPlaced && (
              <Button
                variant="contained"
                style={{ backgroundColor: "red", color: "white" }}
                onClick={handleOrder}
              >
                Order Now
              </Button>
            )}
          </Box>
          {orderPlaced ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <h1>Your order has been placed!</h1>
            </Box>
          ) : (
            <Grid
              columnGap={2}
              rowGap={2}
              justifyContent="space-around"
              container
              sx={{ m: 2 }}
            >
              {cartItems.map((item, index) => {
                return (
                  <Grid
                    key={item._id}
                    sx={{
                      p: 1,
                      backgroundColor: "rgb(255, 195, 0, 0.5)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 10px rgb(255, 195, 0, 0.5)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                    xs={12}
                    sm={6}
                    md={3.5}
                  >
                    <Image
                      style={{ borderRadius: "5px" }}
                      src={`${item.img}`}
                      alt={`${item.title}`}
                      width={110}
                      height={90}
                    />
                    <Typography>
                      <h3>{item.itemName}</h3>
                    </Typography>
                    <Typography>
                      <h3>Price: {item.itemPrice}</h3>
                    </Typography>
                    <Typography>
                      <Button
                        onClick={() =>
                          updateCartItemCounter(item._id, item.itemCounter - 1)
                        }
                      >
                        -
                      </Button>
                      <span>{item.itemCounter}</span>
                      <Button
                        onClick={() =>
                          updateCartItemCounter(item._id, item.itemCounter + 1)
                        }
                      >
                        +
                      </Button>
                    </Typography>
                    <Button onClick={() => removeItemFromCart(item._id)}>
                      Remove
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}
    </>
  );
}
