d# Fix Mongoose Duplicate Index Warnings

## Progress
- [x] Create TODO.md ✅
- [x] Edit Product.js - remove duplicate {sku:1} index ✅
- [x] Edit PurchaseOrder.js - remove duplicate {poNumber:1} index ✅ 
- [x] Edit Category.js - remove duplicate {name:1} index ✅
- [x] Verify warnings gone & complete ✅

## Plan Details
Remove explicit schema.index() calls that duplicate unique:true field indexes:
1. Product.js: Remove `ProductSchema.index({ sku: 1 });`
2. PurchaseOrder.js: Remove `PurchaseOrderSchema.index({ poNumber: 1 });`
3. Category.js: Remove `CategorySchema.index({ name: 1 });`

