import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../App";
import { Button, Typography } from "@mui/material";
import Image from "mui-image";

export default function Itemm({ itemPrice, itemName, img, _id }) {
  const { isSigned, totalCart, setTotalCart, count, setCount } =
    useContext(Context);
  const [itemCounter, setItemCounter] = useState(0);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("cartItems"))) {
      let cartItems = JSON.parse(localStorage.getItem("cartItems"));
      // eslint-disable-next-line array-callback-return
      cartItems.map((item) => {
        if (item._id === _id) {
          setItemCounter(item.itemCounter);
          setCount(cartItems.length);
          setTotalCart((current) => current + item.itemPrice);
        }
      });
    } else {
      setItemCounter(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decCount = () => {
    if (itemCounter === 1) {
      setCount(count - 1);
      setItemCounter(0);
      setTotalCart((parseFloat(totalCart) - parseFloat(itemPrice)).toFixed(2));
      let cartItems = JSON.parse(localStorage.getItem("cartItems"));
      const updatedCart = cartItems.filter((item) => item._id !== _id);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    } else if (itemCounter > 1) {
      setItemCounter(itemCounter - 1);
      setTotalCart((parseFloat(totalCart) - parseFloat(itemPrice)).toFixed(2));
      let cartItems = JSON.parse(localStorage.getItem("cartItems"));
      const updatedCart = cartItems.map((item) => {
        if (item._id === _id) {
          item.itemCounter = itemCounter - 1;
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    }
    if (parseFloat(totalCart) < 0) {
      setTotalCart("0.00");
    }
  };
  const incCount = () => {
    if (!isSigned) {
      alert("Sign in or Register to add items to your cart");
    } else {
      if (itemCounter < 1) {
        setCount(count + 1);
      }
      setTotalCart((parseFloat(totalCart) + parseFloat(itemPrice)).toFixed(2));
      setItemCounter(itemCounter + 1);
      if (!JSON.parse(localStorage.getItem("cartItems"))) {
        localStorage.setItem("cartItems", JSON.stringify([]));
      }
      let flag = false;
      let data = { itemPrice, itemName, _id, itemCounter, img };
      let cartItems = JSON.parse(localStorage.getItem("cartItems"));
      // eslint-disable-next-line array-callback-return
      cartItems.map((item) => {
        if (item._id === _id) {
          flag = true;
          item.itemCounter = itemCounter + 1;
        }
      });
      if (!flag) {
        data.itemCounter = 1;
        cartItems.push(data);
      }
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  };

  return (
    <>
      <Typography>{itemName}</Typography>
      <Image
        style={{ borderRadius: "5px" }}
        width={130}
        height={100}
        src={img}
        alt={itemName}
      />
      <Typography>Price: {itemPrice}</Typography>
      <Typography>
        <Button onClick={decCount}>-</Button>
        <span>{itemCounter}</span>
        <Button onClick={incCount}>+</Button>
      </Typography>
    </>
  );
}
