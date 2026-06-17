import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  UserIcon,
  MenuIcon,
  XIcon,
  LayoutGridIcon,
  CalendarIcon,
  FileTextIcon,
  DollarSignIcon,
  SettingsIcon,
  LogOutIcon,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [userName, setUserName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const role = user?.role || "EMPLOYEE";

  useEffect(() => {
    api.get("/profile").then(({ data }) => {
      if (data.firstName)
        setUserName(`${data.firstName} ${data.lastName || ""}`.trim());
    });
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGridIcon },
    role === "ADMIN" && { name: "Employees", href: "/employees", icon: UserIcon },
    role === "EMPLOYEE" && { name: "Attendance", href: "/attendance", icon: CalendarIcon },
    { name: "Leave", href: "/leave", icon: FileTextIcon },
    { name: "Payslips", href: "/payslips", icon: DollarSignIcon },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ].filter(Boolean);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand header */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <UserIcon className="text-white w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-[13px] text-white tracking-wide">
              Employee MS
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              Management System
            </p>
          </div>
        </div>
      </div>

      {/* User profile card */}
      {userName && (
        <div className="mx-3 mt-4 mb-1 p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-500/80 text-white text-sm font-semibold shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-slate-200 truncate">
                {userName}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {role === "ADMIN" ? "Administrator" : "Employee"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section label */}
      <div className="px-5 pt-5 pb-2 text-[10px] uppercase text-slate-500 tracking-widest font-semibold">
        Navigation
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-500">
            <Loader2 className="animate-spin w-5 h-5" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-400" />
                )}
                <item.icon className="w-[17px] h-[17px] shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })
        )}
      </div>

      {/* Logout */}
      <div className="p-3 mt-auto border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150"
        >
          <LogOutIcon className="w-[17px] h-[17px] shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger — inside top navbar area */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-slate-900 text-white border border-white/10 shadow-md"
        aria-label="Open menu"
      >
        <MenuIcon size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile header with close button */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
              <UserIcon className="text-white w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-white">Employee MS</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Skip brand header in mobile since we have the row above */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* User profile card */}
          {userName && (
            <div className="mx-3 mt-4 mb-1 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-500/80 text-white text-sm font-semibold shrink-0">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-slate-200 truncate">
                    {userName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {role === "ADMIN" ? "Administrator" : "Employee"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section label */}
          <div className="px-5 pt-5 pb-2 text-[10px] uppercase text-slate-500 tracking-widest font-semibold">
            Navigation
          </div>

          {/* Nav items */}
          <div className="flex-1 px-3 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-400" />
                  )}
                  <item.icon className="w-[17px] h-[17px] shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <div className="p-3 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150"
            >
              <LogOutIcon className="w-[17px] h-[17px] shrink-0" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col h-full w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shrink-0 border-r border-white/5">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;