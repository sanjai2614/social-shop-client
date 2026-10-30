
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import AdminSidebar from "../components/layout/AdminSidebar";

const AdminLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Close mobile sidebar whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling while mobile menu is open
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6">
  <div className="flex min-w-0 items-center gap-3">
    {/* Mobile menu button */}
    <button
      type="button"
      onClick={() => setMenuOpen((prev) => !prev)}
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      className="rounded-xl p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
    >
      {menuOpen ? <X size={22} /> : <Menu size={22} />}
    </button>

  

    {/* Admin title */}
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
      <ShieldCheck size={22} />
    </div>

    <div className="min-w-0">
      <h1 className="truncate text-base font-bold sm:text-lg">
        SocialShop Admin
      </h1>
      <p className="hidden text-xs text-gray-500 sm:block">
        Manage your platform
      </p>
    </div>
      {/* Desktop collapse button - LEFT SIDE */}
    <button
      type="button"
      onClick={() => setCollapsed((prev) => !prev)}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className="hidden rounded-xl border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 lg:inline-flex"
    >
      {collapsed ? (
        <PanelLeftOpen size={20} />
      ) : (
        <PanelLeftClose size={20} />
      )}
    </button>
  </div>

  {/* Back to User Page */}
  <Link
    to="/"
    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-700 sm:px-4"
  >
    <ArrowLeft size={17} />
    <span className="hidden sm:inline">Back to User Page</span>
    <span className="sm:hidden">User Page</span>
  </Link>
</header>

      <div className="flex min-h-[calc(100dvh-4rem)]">
        {/* Desktop sidebar */}
        <aside
          className={`sticky top-16 hidden h-[calc(100dvh-4rem)] shrink-0 self-start border-r border-gray-200 bg-white transition-[width] duration-300 ease-in-out lg:block ${
            collapsed ? "w-19" : "w-64"
          }`}
        >
          <AdminSidebar
            collapsed={collapsed}
            onNavigate={() => setMenuOpen(false)}
          />
        </aside>

        {/* Mobile overlay */}
        {menuOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 top-16 z-40 bg-gray-950/40 backdrop-blur-[2px] lg:hidden"
          />
        )}

        {/* Mobile sidebar */}
        <aside
          aria-label="Admin navigation"
          className={`fixed bottom-0 left-0 top-16 z-40 w-72 max-w-[85vw] border-r border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          <AdminSidebar
            collapsed={false}
            onNavigate={() => setMenuOpen(false)}
          />
        </aside>

        {/* Main content */}
        <main
          onClick={() => {
            if (menuOpen) setMenuOpen(false);
          }}
          className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"
        >
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
