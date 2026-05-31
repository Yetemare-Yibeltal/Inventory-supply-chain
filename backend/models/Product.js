const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  quantityOnHand: { type: Number, required: true, min: 0, default: 0 },
  reorderPoint: { type: Number, required: true, min: 0, default: 10 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

ProductSchema.index({ category: 1 });
ProductSchema.index({ supplier: 1 });
ProductSchema.index({ quantityOnHand: 1, reorderPoint: 1 });
module.exports = mongoose.model("Product", ProductSchema);
