import { Grid } from "@mui/material";
import "./Card.css";
import Image from "mui-image";
import fruits from "../assets/image/fruits.png";
import vegetables from "../assets/image/vegetables.png";
import drinks from "../assets/image/drinks.png";
import snacks from "../assets/image/snacks.png";
import cleaning from "../assets/image/cleaning.png";
import elctronics from "../assets/image/elctronics.png";
import { Link, useNavigate } from "react-router-dom";
export default function Card() {
  const items = [
    {
      img: vegetables,
      title: "Vegetables",
      nav: "vegetables",
    },
    {
      img: fruits,
      title: "Fruits",
      nav: "fruits",
    },
    {
      img: drinks,
      title: "Drinks",
      nav: "drinks",
    },
    {
      img: snacks,
      title: "Snacks",
      nav: "snacks",
    },
    {
      img: cleaning,
      title: "Cleaning",
      nav: "cleaning",
    },
    {
      img: elctronics,
      title: "Electronics",
      nav: "electronics",
    },
  ];
  const navigate = useNavigate();
  const handleLinkClick = (nav) => {
    console.log(nav);
    navigate("/items", { state: { nav } });
  };
  return (
    <Grid columnGap={2} rowGap={2} justifyContent={"space-around"} container>
      {items.map((item, index) => {
        return (
          <Grid
            key={index}
            sx={{
              p: 1,
              backgroundColor: " rgb(255, 195, 0, 0.5)",
              borderRadius: "8px",
              boxShadow: " 0 4px 10px rgb(255, 195, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            xs={12}
            sm={6}
            md={3.5}
            onClick={() => handleLinkClick(item.nav)}
          >
            <br />
            <Link
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Image
                style={{ borderRadius: "5px" }}
                src={`${item.img}`}
                alt={`${item.title}`}
                width={130}
                height={100}
              />
              <h3>
                <br />
                {`${item.title}`}
              </h3>
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
}
