import "./Home.css";
import MainNav from "../layout/MainNav";
import MainNavSigned from "../layout/MainNavSigned";
import { Box } from "@mui/material";
import marketBackground from "../assets/image/marketBackground.jpg";
import Card from "../layout/Card";
import { Context } from "../../App";
import { useContext } from "react";
import AdminNav from "../layout/AdminNav";
export default function Home() {
  const { isSigned, currentUser } = useContext(Context);
  return (
    <>
      {currentUser.role === "admin" ? (
        <AdminNav />
      ) : !isSigned ? (
        <MainNav />
      ) : (
        <MainNavSigned />
      )}

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
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: "25px",
          }}
        >
          <h1 className="welcome">
            Welcome To MiniMart {isSigned ? currentUser?.fullName : ""}
            🙋‍♀️&#128512;
          </h1>
          <Card />
        </Box>
      </Box>
    </>
  );
}
