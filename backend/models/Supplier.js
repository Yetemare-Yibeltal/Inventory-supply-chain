const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  contactName: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

SupplierSchema.index({ name: 1 });
SupplierSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Supplier", SupplierSchema);
