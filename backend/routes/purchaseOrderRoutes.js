const express = require("express");
const {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updateOrderStatus,
  deletePurchaseOrder,
  autoCreateLowStockPOs,
} = require("../controllers/purchaseOrderController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

// Public read routes
router
  .route("/")
  .get(getPurchaseOrders)
  .post(protect, authorize("admin", "manager"), createPurchaseOrder);

router.post(
  "/auto-create",
  protect,
  authorize("admin", "manager"),
  autoCreateLowStockPOs,
);

router
  .route("/:id")
  .get(getPurchaseOrderById)
  .delete(protect, authorize("admin"), deletePurchaseOrder);

router.put(
  "/:id/status",
  protect,
  authorize("admin", "manager"),
  updateOrderStatus,
);

module.exports = router;
