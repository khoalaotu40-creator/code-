import React, { useEffect, useState } from "react";
import { Database, Sparkles, Monitor, Moon, Sun } from "lucide-react";
import { User } from "../types";

interface SettingsViewProps {
  user: User | null;
  token: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function SettingsView({}: SettingsViewProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("se104_theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("se104_theme", "light");
      setTheme("light");
    }
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-8 animate-fade-in text-on-surface">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-on-surface">Cài đặt hệ thống SE104.Q28</h2>
        <p className="text-xs text-on-surface-variant mt-1">Cấu hình giao diện, dữ liệu bảo mật và quản lý hệ thống lưu trữ dự án.</p>
      </div>

      <div className="border-t border-outline-variant/60 pt-6 space-y-4">
        <h3 className="font-bold text-sm flex items-center gap-1.5 text-primary">
          <Monitor className="h-4.5 w-4.5" />
          <span>Giao diện hệ thống</span>
        </h3>
        <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/65">
          <div className="space-y-1">
            <p className="text-sm font-bold text-on-surface">Chế độ hiển thị</p>
            <p className="text-xs text-on-surface-variant">Thay đổi giữa chế độ nền sáng và nền tối tự động</p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-semibold text-xs hover:bg-primary/20 transition-colors"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {theme === "light" ? "Chế độ tối" : "Chế độ sáng"}
          </button>
        </div>
      </div>

      <div className="border-t border-outline-variant/60 pt-6 space-y-4">
        <h3 className="font-bold text-sm flex items-center gap-1.5 text-primary">
          <Database className="h-4.5 w-4.5" />
          <span>Hệ thống dữ liệu & File db.json</span>
        </h3>
        <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/65 text-xs text-on-surface-variant leading-relaxed space-y-2">
          <p className="font-bold text-on-surface flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-amber-500 animate-spin" />
            <span>Cơ sở dữ liệu: Hoạt động toàn diện</span>
          </p>
          <p>Ứng dụng đã được cấu hình lưu trữ dữ liệu vĩnh viễn và tự động đồng bộ hóa thông tin của người dùng qua file cục bộ máy chủ <code className="font-mono bg-white px-1 py-0.5 rounded border">db.json</code>.</p>
          <p>Môn học phát triển: <strong className="text-on-surface">SE104.Q28 - Quản lý dự án</strong>.</p>
        </div>
      </div>
    </div>
  );
}
