const mongoose = require("mongoose");
const User = require("./User");
const { itemsSchema } = require("./Items");
const Schema = mongoose.Schema;
const ordersSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    items: [
      {
        itemPrice: {
          type: Number,
          required: true,
        },
        itemName: {
          type: String,
          required: true,
        },
        img: {
          type: String,
          required: true,
        },
        itemCounter: {
          type: Number,
          required: true,
        },
      },
    ],
    orderDate: Date,
    orderStatus: String,
    total: Number,
  },
  { timestamps: true }
);
const Orders = mongoose.model("Orders", ordersSchema);
module.exports = Orders;
