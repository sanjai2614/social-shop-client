
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import BottomNavbar from "../components/layout/BottomNavbar";
import Sidebar from "../components/layout/Sidebar";
import { useState } from "react";

const MainLayout = () => {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const hideNavigation =
    ["/login", "/register"].includes(location.pathname) ||
    location.pathname.startsWith("/admin");

  if (location.pathname.startsWith("/admin")) {
    return <Outlet />;
  }

  const isReelsPage = location.pathname === "/reels";

  if (isReelsPage) {
    return (
      <div className="h-dvh overflow-hidden bg-black">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50">
      {!hideNavigation && <Navbar onMenuClick={() => setMobileMenuOpen(true)} />}

      {!hideNavigation && (
        <div className="mx-auto flex w-full max-w-screen-2xl">
          {/* Sidebar handles its own desktop/mobile visibility */}
          <Sidebar
  menuOpen={mobileMenuOpen}
  onClose={() => setMobileMenuOpen(false)}
/>

          <main className="min-w-0 flex-1 pb-20 lg:pb-6">
            <Outlet />
          </main>
        </div>
      )}

      {hideNavigation && <Outlet />}

      {!hideNavigation && (
        <div className="lg:hidden">
          <BottomNavbar />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
