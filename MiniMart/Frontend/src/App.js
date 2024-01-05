import { Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import Profile from "./components/pages/Profile";
import Orders from "./components/pages/Orders";
import SignIn from "./components/pages/SignIn";
import UserReg from "./components/Forms/UserReg";
import ResetPass from "./components/Forms/ResetPass";
import Cart from "./components/pages/Cart";
import { createContext, useEffect, useState } from "react";
import AddItem from "./components/Forms/AddItem";
import Items from "./components/Category/Items";
import AllOrders from "./components/pages/AllOrders";
export const Context = createContext();
export default function App() {
  const [isSigned, setIsSigned] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [totalCart, setTotalCart] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    // setIsSigned(JSON.parse(localStorage.getItem("isSigned")));
    const checkToken = () => {
      fetch("http://localhost:3000/isUserAuth", {
        method: "POST",
        body: JSON.stringify({ token: localStorage.getItem("token") }),
        headers: { "Content-Type": "application/json" },
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.status) {
            // console.log(result);
            setCurrentUser(result.data);
            setIsSigned(true);
          }
        });
    };
    checkToken();
  }, []);
  return (
    <Context.Provider
      value={{
        isSigned,
        setIsSigned,
        currentUser,
        setCurrentUser,
        totalCart,
        setTotalCart,
        count,
        setCount,
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/user-reg" element={<UserReg />} />
        <Route path="/reset-password" element={<ResetPass />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/items" element={<Items />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/all-orders" element={<AllOrders />} />
        <Route path="/add-item" element={<AddItem />} />
      </Routes>
    </Context.Provider>
  );
}
