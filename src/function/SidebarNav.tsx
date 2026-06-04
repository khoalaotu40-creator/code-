import React from "react";
import { ChevronLeft, ChevronRight, Home, LayoutDashboard, Settings as SettingsIcon, LogOut, User as UserIcon } from "lucide-react";
import { User } from "../types";

interface SidebarNavProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentPage: string;
  selectedBoard: any;
  user: User | null;
  onNavigate: (page: string) => void;
  handleLogout: () => void;
}

export default function SidebarNav({
  isSidebarCollapsed,
  toggleSidebar,
  currentPage,
  selectedBoard,
  user,
  onNavigate,
  handleLogout,
}: SidebarNavProps) {
  return (
    <nav
      id="sidebar_nav"
      className={`h-full shrink-0 flex flex-col justify-between py-6 bg-surface-container-lowest border-r border-outline-variant shadow-sm z-50 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? "w-[72px] px-2" : "w-[260px] px-4"
      }`}
    >
      <div>
        <div className={`mb-8 flex ${isSidebarCollapsed ? "flex-col items-center gap-3 px-1" : "items-center justify-between gap-2 px-3"}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-10 h-10 shrink-0 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg shadow-sm">
              S
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0">
                <h1 className="font-semibold text-base text-primary leading-none mb-1 truncate">
                  SE104.Q28
                </h1>
                <p className="text-xs text-on-surface-variant font-medium truncate">
                  Project Management
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleSidebar}
            className={`p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all duration-200 cursor-pointer ${isSidebarCollapsed ? "w-9 h-9 flex items-center justify-center mt-1" : ""}`}
            title={isSidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4.5 w-4.5" />
            ) : (
              <ChevronLeft className="h-4.5 w-4.5" />
            )}
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            id="tab_feed"
            onClick={() => onNavigate("feed")}
            title={isSidebarCollapsed ? "Trang chủ" : undefined}
            className={`flex items-center gap-3 py-3 rounded-lg font-semibold text-sm transition-all text-left ${
              currentPage === "feed" && !selectedBoard
                ? "bg-primary-container text-on-primary-container scale-98"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            } ${isSidebarCollapsed ? "justify-center px-0 w-11 mx-auto" : "px-4"}`}
          >
            <Home className="h-5 w-5 shrink-0" />
            {!isSidebarCollapsed && <span>Trang chủ</span>}
          </button>

          <button
            id="tab_boards"
            onClick={() => onNavigate("boards")}
            title={isSidebarCollapsed ? "Bảng công việc" : undefined}
            className={`flex items-center gap-3 py-3 rounded-lg font-semibold text-sm transition-all text-left ${
              currentPage === "boards" && !selectedBoard
                ? "bg-primary-container text-on-primary-container scale-98"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            } ${isSidebarCollapsed ? "justify-center px-0 w-11 mx-auto" : "px-4"}`}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            {!isSidebarCollapsed && <span>Bảng công việc</span>}
          </button>

          <button
            id="tab_profile"
            onClick={() => onNavigate("profile")}
            title={isSidebarCollapsed ? "Hồ sơ cá nhân" : undefined}
            className={`flex items-center gap-3 py-3 rounded-lg font-semibold text-sm transition-all text-left ${
              currentPage === "profile"
                ? "bg-primary-container text-on-primary-container scale-98"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            } ${isSidebarCollapsed ? "justify-center px-0 w-11 mx-auto" : "px-4"}`}
          >
            <UserIcon className="h-5 w-5 shrink-0" />
            {!isSidebarCollapsed && <span>Hồ sơ cá nhân</span>}
          </button>

          <button
            id="tab_settings"
            onClick={() => onNavigate("settings")}
            title={isSidebarCollapsed ? "Cài đặt hệ thống" : undefined}
            className={`flex items-center gap-3 py-3 rounded-lg font-semibold text-sm transition-all text-left ${
              currentPage === "settings"
                ? "bg-primary-container text-on-primary-container scale-98"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            } ${isSidebarCollapsed ? "justify-center px-0 w-11 mx-auto" : "px-4"}`}
          >
            <SettingsIcon className="h-5 w-5 shrink-0" />
            {!isSidebarCollapsed && <span>Cài đặt hệ thống</span>}
          </button>
        </div>
      </div>

      <div className={`border-t border-outline-variant pt-4 flex flex-col gap-2.5 ${isSidebarCollapsed ? "items-center" : ""}`}>
        <div className={`flex items-center gap-3 py-1.5 ${isSidebarCollapsed ? "px-0 justify-center" : "px-4"}`} title={isSidebarCollapsed ? user?.fullName : undefined}>
          {user?.avatar && user.avatar.length > 10 ? (
             <img src={user.avatar} alt="Avatar" className="w-9 h-9 shrink-0 rounded-full border border-outline-variant object-cover" />
          ) : (
            <div className="w-9 h-9 shrink-0 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
              {user?.avatar || user?.fullName?.charAt(0) || "U"}
            </div>
          )}
          {!isSidebarCollapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-on-surface truncate leading-tight">
                {user?.fullName || "Người dùng"}
              </p>
              <p className="text-[10px] text-on-surface-variant truncate">
                {user?.email || "se104@vn.edu"}
              </p>
            </div>
          )}
        </div>

        <button
          id="btn_logout"
          onClick={handleLogout}
          title={isSidebarCollapsed ? "Đăng xuất" : undefined}
          className={`bg-error-container text-on-error-container font-semibold text-xs py-2 rounded-lg hover:bg-error hover:text-on-error transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
            isSidebarCollapsed ? "px-0 w-10 h-10 rounded-full mx-auto" : "px-4 w-full"
          }`}
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          {!isSidebarCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </nav>
  );
}
