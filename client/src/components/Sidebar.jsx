import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { dummyProfileData } from "../assets/assets";
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
} from "lucide-react";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [userName, setUserName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // role can be ADMIN or EMPLOYEE
  const role = "EMPLOYEE";

  useEffect(() => {
    setUserName(dummyProfileData.firstName + " " + dummyProfileData.lastName);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGridIcon },
    { name: "Attendance", href: "/attendance", icon: CalendarIcon },
    { name: "Leave", href: "/leave", icon: FileTextIcon },
    { name: "Payslips", href: "/payslips", icon: DollarSignIcon },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  const sidebarContent = (
    <>
      {/* Brand header */}
      <div className="px-5 pt-6 pb-5 border-b border-white/6">
        <div className="flex items-center gap-2">
          <UserIcon className="text-white size-7" />
          <div>
            <p className="font-semibold text-[13px] text-white tracking-wide">
              Employee MS
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Management System
            </p>
          </div>
        </div>
      </div>

      {/* User profile card */}
      {userName && (
        <div className="mx-3 mt-4 mb-1 p-3 rounded-lg bg-white/3 border border-white/4">
          <div className="flex items-center gap-3">
            {/* Initial circle */}
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-white text-sm font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            {/* Name + role */}
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-slate-200 truncate">
                {userName}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {role === "ADMIN" ? "Administrator" : "Employee"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section label */}
      <div className="px-5 py-3 text-xs uppercase text-slate-400 tracking-wide">
        Navigation
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150 relative ${
                isActive ? "bg-indigo-500/12 text-indigo-300" : "text-slate-300"
              } hover:text-white hover:bg-white/4`}
            >
              <item.icon className="w-[17px] h-[17px]" />
              <span>{item.name}</span>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-white/6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-150"
        >
          <LogOutIcon className="w-[17px] h-[17px]" />
          <span>Log out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-white/10"
      >
        <MenuIcon size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        ></div>
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white z-50 flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button on mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white p-1 self-end m-3"
        >
          <XIcon size={20} />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col h-full w-65 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white shrink-0 border-r border-white/4">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
