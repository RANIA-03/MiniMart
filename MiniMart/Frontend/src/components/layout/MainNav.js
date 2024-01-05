import { Link } from "react-router-dom";
import logo from "../assets/image/logo.png";
import Image from "mui-image";
import "./MainNav.css";
import { Box } from "@mui/material";
import { useContext } from "react";
import { Context } from "../../App";
export default function MainNav() {
  const { count } = useContext(Context);

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
          <Link className="nav-link" to="/signIn">
            SIGN IN
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
