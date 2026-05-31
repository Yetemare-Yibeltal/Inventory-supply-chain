const PurchaseOrder = require("../models/PurchaseOrder");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");

// Helper to generate unique PO number
const generatePONumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}${month}${day}`;

  // Find the last order created to determine the next sequence
  const lastOrder = await PurchaseOrder.findOne({})
    .sort({ createdAt: -1 })
    .select("poNumber");

  let nextSeq = 1;

  if (lastOrder && lastOrder.poNumber) {
    const parts = lastOrder.poNumber.split("-");
    // parts[1] is the date (YYYYMMDD), parts[2] is the sequence (0001)
    if (parts.length > 2 && parts[1] === dateString) {
      nextSeq = parseInt(parts[2], 10) + 1;
    }
  }

  const seq = String(nextSeq).padStart(4, "0");
  return `PO-${dateString}-${seq}`;
};

// @desc    Create a purchase order
// @route   POST /api/purchase-orders
// @access  Private (Admin/Manager)
const createPurchaseOrder = async (req, res) => {
  try {
    const { supplier, items } = req.body;

    // Validate supplier
    const supplierExists = await Supplier.findById(supplier);
    if (!supplierExists) {
      return res.status(400).json({ message: "Supplier not found" });
    }

    // Validate all products and calculate total
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${item.product} not found` });
      }
      totalAmount += item.quantity * item.unitPrice;
    }

    const poNumber = await generatePONumber();

    const purchaseOrder = await PurchaseOrder.create({
      poNumber,
      supplier,
      items,
      totalAmount,
      orderedBy: req.user._id,
      status: "PENDING",
    });

    const populatedPO = await PurchaseOrder.findById(purchaseOrder._id)
      .populate("supplier", "name")
      .populate("items.product", "name sku")
      .populate("orderedBy", "name");

    res.status(201).json(populatedPO);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all purchase orders
// @route   GET /api/purchase-orders
// @access  Private
const getPurchaseOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const orders = await PurchaseOrder.find({})
      .populate("supplier", "name")
      .populate("items.product", "name sku")
      .populate("orderedBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single purchase order
// @route   GET /api/purchase-orders/:id
// @access  Private
const getPurchaseOrderById = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id)
      .populate("supplier", "name contactName email phone")
      .populate("items.product", "name sku price")
      .populate("orderedBy", "name");
    if (!order) {
      return res.status(404).json({ message: "Purchase order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update purchase order status
// @route   PUT /api/purchase-orders/:id/status
// @access  Private (Admin/Manager)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["PENDING", "APPROVED", "SHIPPED", "RECEIVED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    order.status = status;
    await order.save();

    // If status changes to RECEIVED, update product quantities
    if (status === "RECEIVED") {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.quantityOnHand += item.quantity;
          await product.save();
        }
      }
    }

    const updated = await PurchaseOrder.findById(order._id)
      .populate("supplier", "name")
      .populate("items.product", "name sku");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete purchase order
// @route   DELETE /api/purchase-orders/:id
// @access  Private (Admin only)
const deletePurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Purchase order not found" });
    }
    await order.deleteOne();
    res.json({ message: "Purchase order removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auto-create purchase orders for low stock products
// @route   POST /api/purchase-orders/auto-create
// @access  Private (Admin/Manager)
const autoCreateLowStockPOs = async (req, res) => {
  try {
    // Find low stock products
    const lowStockProducts = await Product.find({
      $expr: { $lte: ["$quantityOnHand", "$reorderPoint"] },
    }).populate("supplier", "name");

    // Group by supplier
    const supplierMap = new Map();
    for (const product of lowStockProducts) {
      const supplierId = product.supplier._id.toString();
      if (!supplierMap.has(supplierId)) {
        supplierMap.set(supplierId, {
          supplier: product.supplier,
          items: [],
        });
      }
      // Suggest order quantity: reorderPoint * 2
      const suggestedQty = Math.max(product.reorderPoint * 2, 10);
      supplierMap.get(supplierId).items.push({
        product: product._id,
        quantity: suggestedQty,
        unitPrice: product.price,
      });
    }

    // Create a purchase order for each supplier
    const createdOrders = [];
    for (const [supplierId, data] of supplierMap) {
      let totalAmount = 0;
      for (const item of data.items) {
        totalAmount += item.quantity * item.unitPrice;
      }
      const poNumber = await generatePONumber();
      const order = await PurchaseOrder.create({
        poNumber,
        supplier: supplierId,
        items: data.items,
        totalAmount,
        orderedBy: req.user._id,
        status: "PENDING",
      });
      const populated = await PurchaseOrder.findById(order._id)
        .populate("supplier", "name")
        .populate("items.product", "name sku");
      createdOrders.push(populated);
    }

    res.status(201).json({
      message: `${createdOrders.length} purchase orders created`,
      orders: createdOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updateOrderStatus,
  deletePurchaseOrder,
  autoCreateLowStockPOs,
};
