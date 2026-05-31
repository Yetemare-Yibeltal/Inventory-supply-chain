const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

// Public read routes
router
  .route("/")
  .get(getCategories)
  .post(protect, authorize("admin", "manager"), createCategory);

router
  .route("/:id")
  .get(getCategoryById)
  .put(protect, authorize("admin", "manager"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);

module.exports = router;
