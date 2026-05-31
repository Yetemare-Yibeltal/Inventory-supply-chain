import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import QueryProvider from "./components/QueryProvider";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Layout from "./components/Layout/Layout";
import PrivateRoute from "./components/common/PrivateRoute";
import Spinner from "./components/common/Spinner";

// Lazy-loaded high-performance core dashboard panels
const LazyDashboard = lazy(() => import("./pages/Dashboard"));
const LazyProducts = lazy(() => import("./pages/Products"));
const LazyCategories = lazy(() => import("./pages/Categories"));
const LazySuppliers = lazy(() => import("./pages/Suppliers"));
const LazyPurchaseOrders = lazy(() => import("./pages/PurchaseOrders"));
const LazyLowStock = lazy(() => import("./pages/LowStock"));

function App() {
  return (
    <AuthProvider>
      <QueryProvider>
        <Router>
          <Routes>
            {/* Public Authentication Channels */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Enterprise Supply Chain Routing Domains */}
            <Route element={<PrivateRoute />}>
              <Route
                element={
                  <Suspense fallback={<Spinner />}>
                    <Layout />
                  </Suspense>
                }
              >
                <Route path="/" element={<LazyDashboard />} />
                <Route path="/dashboard" element={<LazyDashboard />} />
                <Route path="/products" element={<LazyProducts />} />
                <Route path="/categories" element={<LazyCategories />} />
                <Route path="/suppliers" element={<LazySuppliers />} />
                <Route
                  path="/purchase-orders"
                  element={<LazyPurchaseOrders />}
                />
                <Route path="/low-stock" element={<LazyLowStock />} />
              </Route>
            </Route>

            {/* Universal Fallback Trapping Boundary */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </QueryProvider>
    </AuthProvider>
  );
}

export default App;

