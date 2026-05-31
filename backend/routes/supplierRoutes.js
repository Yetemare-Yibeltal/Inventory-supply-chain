const express = require("express");
const {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

// Public read routes
router
  .route("/")
  .get(getSuppliers)
  .post(protect, authorize("admin", "manager"), createSupplier);

router
  .route("/:id")
  .get(getSupplierById)
  .put(protect, authorize("admin", "manager"), updateSupplier)
  .delete(protect, authorize("admin"), deleteSupplier);

module.exports = router;
