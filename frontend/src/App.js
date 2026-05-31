import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import QueryProvider from "./components/QueryProvider";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Layout from "./components/Layout/Layout";
import PrivateRoute from "./components/common/PrivateRoute";
import Spinner from "./components/common/Spinner";

// Lazy loaded components
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
            {/* Public Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes with Layout */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route
                  path="/"
                  element={
                    <Suspense fallback={<Spinner />}>
                      <LazyDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <Suspense fallback={<Spinner />}>
                      <LazyDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <Suspense fallback={<Spinner />}>
                      <LazyProducts />
                    </Suspense>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <Suspense fallback={<Spinner />}>
                      <LazyCategories />
                    </Suspense>
                  }
                />
                <Route
                  path="/suppliers"
                  element={
                    <Suspense fallback={<Spinner />}>
                      <LazySuppliers />
                    </Suspense>
                  }
                />
                <Route
                  path="/purchase-orders"
                  element={
                    <Suspense fallback={<Spinner />}>
                      <LazyPurchaseOrders />
                    </Suspense>
                  }
                />
                <Route
                  path="/low-stock"
                  element={
                    <Suspense fallback={<Spinner />}>
                      <LazyLowStock />
                    </Suspense>
                  }
                />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </QueryProvider>
    </AuthProvider>
  );
}

export default App;
