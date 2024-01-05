import { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import MainNav from "../layout/MainNav";
import MainNavSigned from "../layout/MainNavSigned";
import { Box, Grid, CircularProgress, TextField } from "@mui/material";
import Itemm from "./Itemm";
import "./item-card.css";
import { useLocation } from "react-router-dom";
import AdminNav from "../layout/AdminNav";
export default function Items() {
  const [itemss, setItemss] = useState([]);
  const location = useLocation();
  const nav = location.state && location.state.nav;
  useEffect(() => {
    fetch(`http://localhost:3000/items/${nav}`, {
      method: "POST",
      body: JSON.stringify({ nav }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        setItemss(result);
      });
  }, [nav]);
  const { isSigned, currentUser } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Array.isArray(itemss) && itemss.length > 0) {
      setLoading(false);
    }
  }, [itemss]);

  return (
    <>
      {currentUser.role === "admin" ? (
        <AdminNav />
      ) : !isSigned ? (
        <MainNav />
      ) : (
        <MainNavSigned />
      )}
      <Box sx={{ display: "flex", alignItems: "center", m: 2 }}>
        <h2>Category: {nav.charAt(0).toUpperCase() + nav.slice(1)}</h2>{" "}
      </Box>{" "}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid columnGap={2} rowGap={2} justifyContent="space-around" container>
          {itemss.map((item, index) => (
            <Grid
              key={index}
              sx={{
                backgroundColor: " rgb(255, 195, 0, 0.5)",
                borderRadius: "8px",
                boxShadow: " 0 4px 10px rgb(255, 195, 0, 0.5)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              item
              xs={12}
              sm={6}
              md={3.5}
            >
              <Itemm
                itemName={item.itemName}
                itemPrice={item.itemPrice}
                img={item.img}
                _id={item._id}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
