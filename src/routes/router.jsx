import { createBrowserRouter } from "react-router-dom";

// routes
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

// pages
import MainLayout from "../layouts/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import Notifications from "../pages/Notifications.jsx";
import NotFound from "../pages/NotFound.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import Profile from "../pages/Profile.jsx";
import SavedPosts from "../pages/SavedPosts.jsx";
import Search from "../pages/Search.jsx";
import Products from "../pages/admin/Products.jsx";
import AdminRoute from "./AdminRoute.jsx";
import Categories from "../pages/admin/Categories.jsx";
import CustomerProducts from "../pages/Products.jsx";
import Cart from "../pages/Cart.jsx";
import ProductDetails from "../pages/ProductDetails.jsx";
import OrderConfirmation from "../pages/OrderConfirmation.jsx";
import Checkout from "../pages/Checkout.jsx";
import MyOrders from "../pages/MyOrders.jsx";
import Orders from "../pages/admin/Orders.jsx";
import OrderDetails from "../pages/admin/OrderDetails.jsx";
import Dashboard from "../pages/admin/Dashboard.jsx";
import Users from "../pages/admin/Users.jsx";
import AdminPosts from "../pages/admin/AdminPosts.jsx";
import AdminComments from "../pages/admin/AdminComments.jsx";
import CreatePost from "../pages/CreatePost.jsx";
import Reels from "../pages/Reels.jsx";
import AdminReels from "../pages/admin/AdminReels.jsx";
import AdminReelComments from "../pages/admin/AdminReelComments.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Home /> },
          { path: "notifications", element: <Notifications /> },
          { path: "profile", element: <Profile /> },
          { path: "profile/:userId", element: <Profile /> },
          { path: "saved-posts", element: <SavedPosts /> },
          { path: "search", element: <Search /> },
          { path: "products", element: <CustomerProducts /> },
          { path: "products/:productId", element: <ProductDetails /> },
          { path: "cart", element: <Cart /> },
          { path: "order-confirmation", element: <OrderConfirmation /> },
          {
            path: "order-confirmation/:orderId",
            element: <OrderConfirmation />,
          },
          { path: "checkout", element: <Checkout /> },
          { path: "my-orders", element: <MyOrders /> },
          { path: "create-post", element: <CreatePost /> },
          { path: "reels", element: <Reels /> },
        ],
      },
      
{
  element: <AdminRoute />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { path: "admin", element: <Dashboard /> },
        { path: "admin/users", element: <Users /> },
        { path: "admin/products", element: <Products /> },
        { path: "admin/categories", element: <Categories /> },
        { path: "admin/orders", element: <Orders /> },
        {
          path: "admin/orders/:orderId",
          element: <OrderDetails />,
        },
        { path: "admin/posts", element: <AdminPosts /> },
        { path: "admin/comments", element: <AdminComments /> },
        { path: "admin/reels", element: <AdminReels /> },
        {
          path: "admin/reel-comments",
          element: <AdminReelComments />,
        },
      ],
    },
  ],
}

    ],
  },
]);

export default router;
