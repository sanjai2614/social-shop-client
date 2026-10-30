import { Link } from "react-router-dom";
import { Bell, ShoppingBag, ShoppingCart, ShieldCheck, Menu } from "lucide-react";

import useNotification from "../../hooks/useNotification.js";
import useAuth from "../../hooks/useAuth.js";
import useCart from "../../hooks/useCart.js";

const Navbar = ({ onMenuClick }) => {
  const { unreadCount, isLoading } = useNotification({
    page: 1,
    limit: 10,
  });

  const { user, isAuthenticated, isAuthLoading } = useAuth();

  const { totalItems, isLoading: isCartLoading } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
<div className="flex items-center gap-2">
  {isAuthenticated && (
    <button
      type="button"
      onClick={onMenuClick}
      aria-label="Open navigation menu"
      className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
    >
      <Menu size={23} />
    </button>
  )}

  <Link to="/" className="flex items-center gap-2">
    <ShoppingBag className="h-6 w-6 text-indigo-600" />
    <span className="text-lg font-bold text-gray-900">
      SocialShop
    </span>
  </Link>
</div>

        <div className="flex items-center gap-3 sm:gap-5">
          {isAuthenticated && (
            <>
              {/* Cart */}
              <Link
                to="/cart"
                aria-label={`Shopping cart${
                  totalItems > 0 ? `, ${totalItems} items` : ""
                }`}
                className="relative rounded-full p-2 text-gray-700 transition hover:bg-gray-100"
              >
                <ShoppingCart className="h-6 w-6" />

                {!isCartLoading && totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-semibold text-white">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <Link
                to="/notifications"
                aria-label={`Notifications${
                  unreadCount > 0 ? `, ${unreadCount} unread` : ""
                }`}
                className="relative rounded-full p-2 text-gray-700 transition hover:bg-gray-100"
              >
                <Bell className="h-6 w-6" />

                {!isLoading && unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
              {/* Admin Panel */}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </Link>
              )}
            </>
          )}

          {!isAuthenticated && !isAuthLoading && (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
