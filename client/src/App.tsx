import { Route, Routes } from "react-router-dom";
import "./App.css";
import LayoutWebsite from "./pages/(website)/layout";
import HomePage from "./pages/(website)/home/page";
import DashBoard from "./pages/(admin)/dashboard/page";
import NotFoundPage from "./pages/(website)/404/page";
import AdminProductsPage from "./pages/(admin)/dashboard/products/page";
import ShopClientPage from "./pages/(website)/shop/page";
import LayoutAdminPage from "./pages/(admin)/layout";
import SigninPage from "./pages/(auth)/signin/page";
import ProductAdd from "./pages/(admin)/dashboard/products/add/page";
import ProductEdit from "./pages/(admin)/dashboard/products/edit/page";
import PrivateRoute from "./pages/(auth)/PrivateRoute/page";
import SignUpPage from "./pages/(auth)/signup/page";
import ProductDetail from "./pages/(website)/products/detail/page";
import RequestPasswordReset from "./pages/(auth)/requestPasswordReset/page";
import ResetPassword from "./pages/(auth)/ResetPassword/page";
import CategoryAdd from "./pages/(admin)/dashboard/categories/add/page";
import CartPage from "./pages/(website)/cart/page";
import CheckoutDetail from "./pages/(website)/checkout/detail/page";
import PaymentPage from "./pages/(website)/checkout/page";
import CheckoutList from "./pages/(website)/checkout/list/page";
import PaymentSuccess from "./pages/(website)/checkout/success/page";
import AdminCategoriesPage from "./pages/(admin)/dashboard/categories/page";
import CategoryEdit from "./pages/(admin)/dashboard/categories/edit/page";

function App() {
  return (
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={<LayoutWebsite />}>
            <Route index element={<HomePage />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="shop" element={<ShopClientPage />} />
            <Route path="cart/:userId" element={<CartPage />} />
            <Route path="/checkout" element={<PaymentPage />} />
            <Route path="/checkout-list" element={<CheckoutList />} />
            <Route path="/checkout/:id" element={<CheckoutDetail />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Route>

          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="sign-in" element={<SigninPage />} />
          <Route path="request-password-reset" element={<RequestPasswordReset />}/>
          <Route path="/reset/:token" element={<ResetPassword />} />

          <Route path="admin" element={<PrivateRoute><LayoutAdminPage /></PrivateRoute>}>
            <Route path="dashboard" element={<DashBoard />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/add" element={<ProductAdd />} />
            <Route path="products/:id/edit" element={<ProductEdit />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="categories/add" element={<CategoryAdd />} />
            <Route path="categories/:id/edit" element={<CategoryEdit />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
