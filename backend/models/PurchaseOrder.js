const mongoose = require("mongoose");

const PurchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
      unitPrice: { type: Number, required: true, min: 0 },
    },
  ],
  totalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "SHIPPED", "RECEIVED"],
    default: "PENDING",
  },
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Remove the problematic pre-save hook or fix it
// This version does NOT use next() incorrectly
PurchaseOrderSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

PurchaseOrderSchema.index({ supplier: 1 });
PurchaseOrderSchema.index({ status: 1, createdAt: -1 });

PurchaseOrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("PurchaseOrder", PurchaseOrderSchema);
