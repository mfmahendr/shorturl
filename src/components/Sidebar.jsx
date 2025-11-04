import { useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  Link2,
  Plus,
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import CreateShortlinkModal from "./CreateShortlinkModal";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    {
      name: "Create Shortlink",
      href: "#",
      icon: Plus,
      action: () => setShowCreateModal(true),
    },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleNavClick = (item) => {
    if (item.action) {
      item.action();
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-lime-500 text-white shadow-lg"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* verlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-6 border-b border-lime-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-lime-400 to-lime-500 rounded-lg flex items-center justify-center shadow-lg">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">ShortURL</h1>
              <p className="text-xs text-lime-600">Link Management</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-lime-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-lime-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;

            return item.action ? (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left
                  ${
                    isActive
                      ? "bg-lime-50 text-lime-700 border-l-4 border-lime-500 shadow-sm"
                      : "text-gray-600 hover:bg-lime-50 hover:text-lime-600"
                  }
                `}
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ) : (
              <a
                key={item.name}
                href={item.href}
                onClick={() => handleNavClick(item)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-lime-50 text-lime-700 border-l-4 border-lime-500 shadow-sm"
                      : "text-gray-600 hover:bg-lime-50 hover:text-lime-600"
                  }
                `}
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Create Shortlink Modal */}
      <CreateShortlinkModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => setShowCreateModal(false)}
      />
    </>
  );
}
