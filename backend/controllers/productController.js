const Product = require("../models/Product");
const Category = require("../models/Category");
const Supplier = require("../models/Supplier");

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Admin/Manager)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      description,
      price,
      quantityOnHand,
      reorderPoint,
      category,
      supplier,
    } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }

    // Check if supplier exists
    const supplierExists = await Supplier.findById(supplier);
    if (!supplierExists) {
      return res.status(400).json({ message: "Supplier not found" });
    }

    // Check if SKU already exists
    const skuExists = await Product.findOne({ sku });
    if (skuExists) {
      return res
        .status(400)
        .json({ message: "Product with this SKU already exists" });
    }

    const product = await Product.create({
      name,
      sku,
      description,
      price,
      quantityOnHand,
      reorderPoint,
      category,
      supplier,
    });

    // Populate category and supplier names
    const populatedProduct = await Product.findById(product._id)
      .populate("category", "name")
      .populate("supplier", "name");

    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find({})
      .populate("category", "name")
      .populate("supplier", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("supplier", "name");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Manager)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      sku,
      description,
      price,
      quantityOnHand,
      reorderPoint,
      category,
      supplier,
    } = req.body;

    product.name = name || product.name;
    product.sku = sku || product.sku;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.quantityOnHand =
      quantityOnHand !== undefined ? quantityOnHand : product.quantityOnHand;
    product.reorderPoint =
      reorderPoint !== undefined ? reorderPoint : product.reorderPoint;
    product.category = category || product.category;
    product.supplier = supplier || product.supplier;

    const updated = await product.save();
    const populated = await Product.findById(updated._id)
      .populate("category", "name")
      .populate("supplier", "name");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get low stock products (quantityOnHand <= reorderPoint)
// @route   GET /api/products/low-stock
// @access  Private
const getLowStockProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      $expr: { $lte: ["$quantityOnHand", "$reorderPoint"] },
    })
      .populate("category", "name")
      .populate("supplier", "name")
      .sort({ quantityOnHand: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
};
