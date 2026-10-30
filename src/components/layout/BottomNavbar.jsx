
import { NavLink } from "react-router-dom";
import { userNavigation } from "../../config/navigation";

const BottomNavbar = () => {
  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="mx-auto grid h-16 max-w-2xl grid-cols-5">
        {userNavigation.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-xs transition ${
                isActive
                  ? "font-semibold text-indigo-600"
                  : "text-gray-500 hover:text-indigo-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={23} strokeWidth={isActive ? 2.5 : 1.8} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;
