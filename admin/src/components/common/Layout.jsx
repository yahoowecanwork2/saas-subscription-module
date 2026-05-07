import { Link, useLocation } from "react-router-dom";
import Header from "./Header";
import { MdDashboard } from "react-icons/md";
import { FaUsers, FaBoxOpen } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import { IoLogOutOutline, IoMenu, IoClose } from "react-icons/io5";
import { useState } from "react";
import { MdOutlineAutoAwesome, MdOutlineHistory } from "react-icons/md";
import { HiOutlineCreditCard } from "react-icons/hi";
// import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAuth, clearLoginData, clearUser } from "../../redux/userSlice";

const Layout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navigation = [
    {
      group: "Overview",
      items: [
        { id: 1, name: "Plans", path: "/plans", icon: MdDashboard },
        // { id: 2, name: "Users", path: "/user", icon: FaUsers },
      ],
    },
    // {
    //   group: "Store Management",
    //   items: [
    //     { id: 3, name: "Orders", path: "/order", icon: BsCartCheckFill },
    //     { id: 4, name: "Products", path: "/product", icon: FaBoxOpen },
    //   ],
    // },
    // {
    //   group: "Billing & Access",
    //   items: [
    //     { id: 5, name: "Plans", path: "/plans", icon: MdOutlineAutoAwesome },
    //     // {
    //     //   id: 6,
    //     //   name: "Payments",
    //     //   path: "/payments",
    //     //   icon: HiOutlineCreditCard,
    //     // },
    //     {
    //       id: 6,
    //       name: "Billing History",
    //       path: "/history",
    //       icon: MdOutlineHistory,
    //     },
    //   ],
    // },
  ];
  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearAuth());
    dispatch(clearLoginData());

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
      fixed inset-y-0 left-0 z-50 lg:w-52 w-64 bg-white border-r border-gray-200
      transform transition-transform duration-200 ease-in-out
      lg:translate-x-0 lg:static
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <Link
            to="/dashboard"
            className="text-lg font-bold tracking-tight text-gray-900"
          >
            StoreAdmin<span className="text-blue-600">.</span>
          </Link>

          <button
            className="lg:hidden p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
            onClick={() => setSidebarOpen(false)}
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col justify-between h-[calc(100vh-4rem)] overflow-y-auto px-4 py-6">
          <div className="space-y-8">
            {navigation.map((section) => (
              <div key={section.group}>
                <h3 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">
                  {section.group}
                </h3>

                <nav className="space-y-2">
                  {section.items.map((menu) => {
                    const isActive = location.pathname === menu.path;
                    const Icon = menu.icon;

                    return (
                      <Link
                        key={menu.id}
                        to={menu.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-all group
                    ${
                      isActive
                        ? "bg-gray-900 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                      >
                        <Icon
                          className={`text-lg ${
                            isActive
                              ? "text-white"
                              : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        />
                        {menu.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-100 pt-4 lg:mt-auto lg:mb-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <IoLogOutOutline className="text-lg" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition"
          >
            <IoMenu size={24} />
          </button>

          <span className="text-sm font-semibold text-gray-900">
            Admin Panel
          </span>

          <div className="w-8" />
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200">
          <Header />
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white  p-6 min-h-full relative">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
