
import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { userSidebarNavigation } from "../../config/navigation";

const Sidebar = ({ menuOpen = false, onClose }) => {
  const location = useLocation();

  // Close drawer when route changes
  useEffect(() => {
    onClose?.();
  }, [location.pathname]);

  // Prevent background scrolling while drawer is open
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const navigationLinks = (
    <nav className="space-y-1.5" aria-label="Main navigation">
      {userSidebarNavigation.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
              isActive
                ? "bg-indigo-50 font-semibold text-indigo-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`
          }
        >
          <Icon size={21} className="shrink-0" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-white px-3 py-5 lg:block">
        {navigationLinks}
      </aside>

      {/* Mobile overlay */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-60 bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Mobile drawer */}
      <aside
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`fixed inset-y-0 left-0 z-70 flex w-72 max-w-[85vw] flex-col border-r border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4">
          <span className="text-base font-bold text-gray-900">
            SocialShop
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={21} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-5">
          {navigationLinks}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
