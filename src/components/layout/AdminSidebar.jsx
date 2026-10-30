
import { NavLink } from "react-router-dom";
import { adminNavigation } from "../../config/navigation";

const AdminSidebar = ({ collapsed = false, onNavigate }) => {
  return (
    <aside className="h-full overflow-y-auto bg-white px-3 py-5">
      {/* Sidebar heading */}
      <div
        className={`mb-5 flex items-center ${
          collapsed ? "justify-center px-0" : "px-3"
        }`}
      >
        {!collapsed ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Admin Panel
          </p>
        ) : (
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600"
            title="Admin Panel"
          >
            A
          </span>
        )}
      </div>

      {/* Navigation links */}
      <nav className="space-y-1.5" aria-label="Admin navigation">
        {adminNavigation.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            aria-label={label}
            className={({ isActive }) =>
              `group relative flex min-h-11 items-center rounded-xl py-3 text-sm transition-all duration-200 ${
                collapsed
                  ? "justify-center px-0"
                  : "gap-3 px-4"
              } ${
                isActive
                  ? "bg-indigo-50 font-semibold text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-indigo-600" />
                )}

                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.3 : 1.8}
                  className="shrink-0"
                />

                {!collapsed && (
                  <span className="truncate">{label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
