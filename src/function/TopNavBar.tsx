import React from "react";
import { ChevronLeft, Search, Bell, Settings as SettingsIcon } from "lucide-react";
import { User, Board } from "../types";

interface TopNavBarProps {
  selectedBoard: Board | null;
  onBack: () => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  showNotifications: boolean;
  setShowNotifications: (val: boolean) => void;
  notifications: any[];
  setNotifications: (val: any[]) => void;
  onNavigateSettings: () => void;
  user: User | null;
}

export default function TopNavBar({
  selectedBoard,
  onBack,
  searchQuery,
  setSearchQuery,
  showNotifications,
  setShowNotifications,
  notifications,
  setNotifications,
  onNavigateSettings,
  user
}: TopNavBarProps) {
  return (
    <header className="h-[64px] shrink-0 flex justify-between items-center px-6 bg-surface-container-lowest border-b border-outline-variant shadow-sm z-40">
      <div className="flex-1 max-w-md flex items-center gap-4">
        {selectedBoard && (
          <button
            onClick={onBack}
            className="p-1 px-2.5 hover:bg-surface-container rounded-lg text-primary text-xs font-semibold flex items-center gap-1 border border-outline-variant/60 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Trở lại</span>
          </button>
        )}

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all text-on-surface"
            placeholder="Tìm kiếm bảng nhanh, nội dung thẻ hoặc nhiệm vụ..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2 py-1 rounded text-[10px] font-semibold border border-emerald-200">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></div>
          <span>API Secure Hoạt động</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all flex items-center justify-center relative border border-outline-variant/60 cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5" />
            {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-lg py-3 z-[100] text-sm">
              <div className="px-4 pb-2 border-b border-outline-variant flex justify-between items-center">
                <span className="font-bold text-xs text-on-surface uppercase tracking-wider">Thông báo dự án</span>
                <button onClick={() => setNotifications([])} className="text-[10px] text-primary hover:underline cursor-pointer">Xóa tất cả</button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-center text-on-surface-variant">Không có thông báo mới.</p>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => alert("Tính năng điều hướng mở trực tiếp pop-up Thẻ Công Việc (Task Modal) đang được phát triển...")}
                      className="p-3 border-b border-outline-variant/30 hover:bg-surface-container-low text-xs text-on-surface transition-all cursor-pointer group"
                    >
                      <p className="group-hover:text-primary transition-colors">{n.text}</p>
                      <p className="text-[10px] text-on-surface-variant mt-1 font-medium">Nhấp để mở chi tiết công việc</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onNavigateSettings}
          className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all flex items-center justify-center border border-outline-variant/60 cursor-pointer"
        >
          <SettingsIcon className="h-4.5 w-4.5" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-outline-variant">
          {user?.avatar && user.avatar.length > 10 ? (
            <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-outline-variant object-cover cursor-pointer" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs cursor-pointer border border-outline-variant">
              {user?.avatar || user?.fullName?.charAt(0) || "U"}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
