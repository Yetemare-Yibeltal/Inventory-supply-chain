# Performance Optimization TODO - inventory-supply-chain/frontend

## Phase 1: Code Splitting & Lazy Loading (IN PROGRESS)
- [x] Create TODO-PERFORMANCE.md ✅
- [x] Update App.js: Add React.lazy() for all routes (Dashboard, Products, Categories, Suppliers, PurchaseOrders, LowStock) ✅
- [x] Update index.js: Wrap root render with Suspense ✅
- [x] Create Skeleton/DashboardSkeleton.jsx ✅
- [x] Create Skeleton/ProductSkeleton.jsx (etc.) ✅
- [x] Update Dashboard.jsx: Use skeletons instead of blocking spinner ✅
- [x] Update Products.jsx: Use skeletons ✅
- [x] Install React Query: `cd inventory-supply-chain/frontend && npm i @tanstack/react-query` ✅
- [x] Update hooks (useDashboardData, useProducts): Use React Query for caching/pagination ✅

## Phase 2: Vite Projects
- [ ] Update hotel-management-system/Client-Side/vite.config.js: Add perf plugins
- [ ] Add lazy loading to App.jsx routes
- [ ] Compress images in assets/images/
- [ ] Similar for doctor-appointment-booking-system, youtube_clone

## Phase 3: Final
- [ ] Run `npm run analyze` to verify bundle size reduction
- [ ] Add service worker/PWA
- [ ] Backend optimizations (pagination)
- [ ] Lighthouse audit

**Next step:** Update App.js with lazy loading.

