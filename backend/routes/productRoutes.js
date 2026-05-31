const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

// Public read routes
router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("admin", "manager"), createProduct);

router.get("/low-stock", getLowStockProducts);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, authorize("admin", "manager"), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct);

module.exports = router;
