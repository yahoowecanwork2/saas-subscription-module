import { IoNotificationsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="h-16 bg-white flex items-center justify-between px-4 lg:px-8">
      {/* Page Title Context */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Divider */}
        <div className="hidden sm:block h-6 w-px bg-gray-200 mx-1"></div>

        {/* User Profile Dropdown Trigger */}
        <button className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-lg transition-colors text-left border border-transparent hover:border-gray-200">
          {/* Initials Avatar (Replaces FaUserCircle for a modern look) */}
          <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
            AD
          </div>

          {/* User Details (Hidden on very small screens to save space) */}
          <div
            onClick={() => navigate("/profile")}
            className="hidden sm:flex flex-col"
          >
            <span className="text-sm font-medium text-gray-900 leading-none mb-1">
              Admin User
            </span>
            <span className="text-xs text-gray-500 leading-none">
              admin@store.com
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
