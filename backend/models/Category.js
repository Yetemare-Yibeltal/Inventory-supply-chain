const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

CategorySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Category", CategorySchema);
