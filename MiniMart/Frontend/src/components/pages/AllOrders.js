import React, { useContext, useEffect, useState } from "react";
import MainNavSigned from "../layout/MainNavSigned";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { Context } from "../../App";
import AdminNav from "../layout/AdminNav";
import MainNav from "../layout/MainNav";

export default function AllOrders() {
  const { currentUser, isSigned } = useContext(Context);
  const [msg, setMsg] = useState();
  const [userOrders, setUserOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/all-orders`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.status) {
          setUserOrders(result.result);
        } else {
          setMsg(result.msg);
        }
      });
  }, [currentUser._id, selectedOrder]);
  useEffect(() => {
    fetch(`http://localhost:3000/update-status-orders`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((result) => result.json())
      .then((result) => {});
  }, [currentUser._id]);
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
  };
  const [editedStatus, setEditedStatus] = useState("");
  const handleEditStatus = (order) => {
    fetch(`http://localhost:3000/update-order-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order._id,
        newStatus: editedStatus,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update order status");
        }
        return response.json();
      })
      .then((result) => {
        if (result.status) {
          const updatedOrders = userOrders.map((o) =>
            o._id === order._id ? { ...o, orderStatus: editedStatus } : o
          );
          setUserOrders(updatedOrders);
          setEditedStatus("");
        } else {
          throw new Error("Failed to update order status");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred while updating order status");
      });
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

      <Box sx={{ m: 3 }}>
        <h1>All Orders: </h1>
        <h3 style={{ fontSize: "40px" }}>
          {msg ? (
            msg
          ) : (
            <Box sx={{ fontSize: "20px", m: 3 }}>
              {userOrders.map((order) => (
                <Box
                  key={order._id}
                  onClick={() => handleOrderClick(order)}
                  sx={{
                    m: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                    backgroundColor: "rgb(255, 195, 0, 0.5)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgb(255, 195, 0, 0.5)",
                    cursor: "pointer",
                  }}
                >
                  <h2>Total: {order.total}</h2>
                  <h2>Status: {order.orderStatus}</h2>
                  <h2>
                    Date:{" "}
                    {new Date(order.orderDate)
                      .toLocaleString("en-GB", { hour12: false })
                      .replace(/\//g, "-")}
                  </h2>
                </Box>
              ))}
            </Box>
          )}
        </h3>
        <Box>
          {userOrders.map((order) =>
            order.showDetails ? (
              <Box
                key={order._id}
                sx={{
                  p: 1,
                  backgroundColor: "rgb(255, 195, 0, 0.5)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgb(255, 195, 0, 0.5)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {order.items.map((item) => (
                  <div key={item._id}>
                    <p>Item Name: {item.itemName}</p>
                    <p>Item Price: {item.itemPrice}</p>
                    <p>Item Counter: {item.itemCounter}</p>
                    <img
                      src={item.img}
                      alt={item.itemName}
                      style={{ width: "100px" }}
                    />
                  </div>
                ))}
              </Box>
            ) : null
          )}
        </Box>
      </Box>
      <Dialog open={selectedOrder !== null} onClose={handleCloseDialog}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <div>
              <div>
                <p>Total: {selectedOrder.total}</p>
                <p>
                  Status:{"  "}
                  <Select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                    style={{ width: "150px", height: "30px" }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                  <Button onClick={() => handleEditStatus(selectedOrder)}>
                    Edit
                  </Button>
                </p>
                <p>********************************************</p>
              </div>
              {selectedOrder.items.map((item) => (
                <div key={item._id}>
                  <p>Item Name: {item.itemName}</p>
                  <p>Item Price: {item.itemPrice}</p>
                  <p>Number Of Items: {item.itemCounter}</p>
                  <img
                    src={item.img}
                    alt={item.itemName}
                    style={{ width: "100px" }}
                  />
                </div>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
