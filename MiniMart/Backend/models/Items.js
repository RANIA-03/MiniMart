const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const itemsSchema = new Schema({
  itemName: { type: String, required: true },
  itemCategory: { type: String, required: true },
  itemPrice: { type: Number, required: true },
  img: { type: String, required: true },
});
const Items = mongoose.model("Items", itemsSchema);
module.exports = { Items, itemsSchema };
