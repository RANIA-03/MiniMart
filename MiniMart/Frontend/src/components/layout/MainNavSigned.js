import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/image/logo.png";
import Image from "mui-image";
import "./MainNavSigned.css";
import { Box } from "@mui/material";
import { Context } from "../../App";

export default function MainNavSigned() {
  const {
    count,
    setCurrentUser,
    setIsSigned,
    setTotalCart,
    totalCart,
    setCount,
  } = useContext(Context);

  const handleSignOut = () => {
    let isConfirmed = true;
    if (totalCart > 0) {
      isConfirmed = window.confirm(
        "Are you sure you want to sign out? Your cart will be cleared. Is this OK?"
      );
    }
    if (isConfirmed) {
      setCurrentUser({});
      setIsSigned(false);
      setTotalCart(0);
      setCount(0);
      // localStorage.setItem("currentUser", JSON.stringify({}));
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("token", JSON.stringify(""));
      // localStorage.setItem("isSigned", JSON.stringify(false));
    }
  };

  return (
    <>
      <Box className="main-nav">
        <Box className="leftSide">
          <Link to="/">
            <Image src={logo} alt="logo" width={130} />
          </Link>
        </Box>
        <Box className="rightSide">
          <Link className="nav-link" to="/">
            HOME
          </Link>
          <Link className="nav-link" to="/profile">
            PROFILE
          </Link>
          <Link className="nav-link" to="/orders">
            ORDERS
          </Link>
          <Link className="nav-link" to="/" onClick={handleSignOut}>
            SIGN OUT
          </Link>
          <Link className="nav-link" to="/cart">
            <i className="fa fa-shopping-cart">
              <span style={{ fontSize: "25px" }}>&nbsp;{count}</span>
            </i>
          </Link>
        </Box>
      </Box>
    </>
  );
}
